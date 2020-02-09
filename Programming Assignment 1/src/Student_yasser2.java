import java.util.*;

public class Student_yasser2 implements Student {
    private class School implements Comparable<School> {
        public School(int i, double q) {
            index = i;
            quality = q;
        }

        private int index;
        private double quality;

        public int compareTo(School n) // smaller pairs are higher quality
        {
            int ret = Double.compare(n.quality, quality);
            return (ret == 0) ? (Integer.compare(index, n.index)) : ret;
        }
    }

    public int[] getApplications(
       int N,
       double S,
       double T,
       double W,
       double aptitude,
       List<Double> schools,
       List<Double> synergies) {
        School[] preferences = new School[schools.size()];
        int[] ret = new int[10];

        // Try different ratios of these numbers.
        for (int i = 0; i < N; ++i) {
            preferences[i] = new School(i,schools.get(i) / T + synergies.get(i) / W);
        }

        Arrays.sort(preferences);

        // Avoiding complexity: safeSchools = 10 - (int) Math.floor(aptitude / 10) % (int) Math.floor(S / 10);
        int safeSchools = 2;
        int preferredSchools = 10 - safeSchools;


        int start = (int) ((1 - aptitude / S) * N) - 15; // pays to be a little optimistic
        if (start > N - 15) {
            start = N - 15;
        }

        if (start < 0) {
            start = 0;
        }

        int increment = start + preferredSchools;
        if (increment > N - safeSchools) {
            increment = N - safeSchools;
        }

        for (int i = 0; i < preferredSchools; ++i) {
            ret[i] = preferences[start + i].index;
        }

        Set<Integer> set = new HashSet<Integer>();
        for (int i = 0; i < safeSchools; ++i) {

            int newIndex = getRandomWithoutRepetition(increment, N - 1, set);
            ret[i + preferredSchools] = preferences[newIndex].index;
            set.add(newIndex);
        }

        return ret;
    }

    private int getRandomWithoutRepetition(int min, int max, Set<Integer> set) {
        int random = 0;
        do {
            Random r = new Random();
            random = r.nextInt((max - min) + 1) + min;

        } while (set.contains(random));

        return random;
    }
}
