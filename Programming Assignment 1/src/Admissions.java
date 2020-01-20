// Testing code for PS1 problem 4
// COS 445 SD1, Spring 2019
// Created by Andrew Wonnacott

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

public class Admissions extends Tournament<Student, AdmissionsConfig> {
   public static final int numApplications = 10;

   Admissions(List<String> studentNames) {
      super(Student.class, studentNames);
   }

   public static void main(String[] args) throws java.io.FileNotFoundException {
      assert args.length >= 1 : "Expected filename of strategies as first argument";

      final int numTrials = 10;
      final AdmissionsConfig config = new AdmissionsConfig(100, 100, 10);
      final BufferedReader namesFile = new BufferedReader(new FileReader(args[0]));
      final List<String> strategyNames =
         namesFile.lines().map(s -> String.format("Student_%s", s)).collect(Collectors.toList());
      final int N = strategyNames.size();
      assert N >= numApplications : "Must have at least 10 strategies in students.txt!";
      final Admissions withStrategies = new Admissions(strategyNames);

      double[] res = withStrategies.oneEachTrials(numTrials, config);
      System.out.println("netID,score");
      for (int i = 0; i != N; ++i) {
         System.out.println(strategyNames.get(i).substring(8) + "," + res[i]);
      }
   }

   public double[] runTrial(List<Class<? extends Student>> strategies, AdmissionsConfig config) {

      // config might randomize each time
      final double S = config.getS();
      final double T = config.getT();
      final double W = config.getW();
      List<Student> students = buildStudents();

      // Initialize random variables
      double[] aptitudes = new double[students.size()];
      double[] schoolsQuality = new double[students.size()];
      double[][] synergies = new double[students.size()][students.size()];

      for (int i = 0; i < students.size(); ++i) {
         aptitudes[i] = rand.nextDouble() * S;
         schoolsQuality[i] = rand.nextDouble() * T;
         for (int j = 0; j < students.size(); ++j) {
            synergies[i][j] = rand.nextDouble() * W;
         }
      }

      // Sort by decreasing order of school quality
      Arrays.sort(schoolsQuality);
      for (int i = 0; i < students.size(); ++i) {
         schoolsQuality[i] = T - schoolsQuality[i];
      }

      PrintStream stdout = System.out;
      System.setOut(new PrintStream(OutputStream.nullOutputStream()));
      System.setOut(stdout);

      // Get each student's choices of schools to which to apply
      int[][] studentsPreferences = buildStudentsPreferences(
         students,
         config,
         schoolsQuality,
         aptitudes,
         synergies);

      ArrayList<ArrayList<Integer>> unisPreferences = buildUniversitiesPreferences(
         studentsPreferences,
         schoolsQuality,
         aptitudes,
         synergies);

      int[] studentsUnis = matchStudentsWithUnis(
         students.size(),
         studentsPreferences,
         unisPreferences);

      return calculatePayoffs(
         students.size(),
         schoolsQuality,
         synergies,
         studentsUnis);
   }

   private static boolean checkLegalStuPrefs(int max, int[] prefs, String netid) {
      assert prefs.length == numApplications
         : netid + ": too many applications" + Arrays.toString(prefs);
      int j = 0, numRepeated = 0;
      while (j < numApplications) {
         assert prefs[j] < max : netid + ": element index out of range" + Arrays.toString(prefs);
         assert prefs[j] >= 0 : netid + ": element index out of range" + Arrays.toString(prefs);
         for (int k = 0; k < j; ++k) {
            if (prefs[k] == prefs[j]) {
               if (numRepeated == 0) {
                  System.err.println(netid + ": repeated applications" + Arrays.toString(prefs));
               }
               for (k = j + 1; k < numApplications; ++k) {
                  prefs[k - 1] = prefs[k];
               }
               numRepeated++;
               continue;
            }
         }
         ++j;
      }

      while (numRepeated > 0) {
         int newApp = rand.nextInt(max);
         for (j = 0; j < numApplications - numRepeated; ++j) {
            if (prefs[j] == newApp) {
               newApp = rand.nextInt(max);
               j = 0;
            }
         }
         prefs[numApplications - numRepeated--] = newApp;
      }
      return true;
   }

   private List<Student> buildStudents() {
      List<Student> students = new ArrayList<Student>();

      for (Class<? extends Student> studentClass : strategies) {
         try {
            students.add(studentClass.getDeclaredConstructor().newInstance());
         } catch (ReflectiveOperationException roe) {
            throw new RuntimeException(roe);
         }
      }

      return students;
   }

   private static ArrayList<ArrayList<Integer>> buildUniversitiesPreferences(
      int[][] studentsPreferences,
      double[] schoolsQuality,
      double[] aptitudes,
      double[][] synergies) {
      // Build university preference lists filtered by applications
      ArrayList<TreeSet<StudentPair>> uniPrefTrees = new ArrayList<TreeSet<StudentPair>>();
      for (int uni = 0; uni < schoolsQuality.length; ++uni) {
         uniPrefTrees.add(new TreeSet<StudentPair>());
      }

      for (int studentIndex = 0; studentIndex < studentsPreferences.length; ++studentIndex) {
         for (int university : studentsPreferences[studentIndex]) {
            uniPrefTrees.get(university).add(
               new StudentPair(
                  studentIndex,
                  aptitudes[studentIndex] + synergies[studentIndex][university]));
         }
      }

      ArrayList<ArrayList<Integer>> uniPrefs = new ArrayList<ArrayList<Integer>>();
      for (TreeSet<StudentPair> prefTree : uniPrefTrees) {
         uniPrefs.add(
            prefTree.stream()
               .map(StudentPair::getIndex)
               .collect(Collectors.toCollection(ArrayList::new)));
      }

      return uniPrefs;
   }

   private int[][] buildStudentsPreferences(
      List<Student> students,
      AdmissionsConfig config,
      double[] schoolsQuality,
      double[] aptitudes,
      double[][] synergies) {
      final double S = config.getS();
      final double T = config.getT();
      final double W = config.getW();

      int[][] studentsPreferences = new int[students.size()][];

      for (int studentIndex = 0; studentIndex < studentsPreferences.length; ++studentIndex) {

         // really gross boxing code
         studentsPreferences[studentIndex] =
            students
               .get(studentIndex)
               .getApplications(
                  students.size(),
                  S,
                  T,
                  W,
                  aptitudes[studentIndex],
                  Collections.unmodifiableList(
                     DoubleStream.of(schoolsQuality).boxed().collect(Collectors.toList())),
                  Collections.unmodifiableList(
                     DoubleStream.of(synergies[studentIndex]).boxed().collect(Collectors.toList())));
         checkLegalStuPrefs(
            students.size(), studentsPreferences[studentIndex], students.get(studentIndex).getClass().getSimpleName());
      }

      return studentsPreferences;
   }

   private int[] matchStudentsWithUnis(
      int studentsCount,
      int[][] studentsPreferences,
      ArrayList<ArrayList<Integer>> unisPreferences) {

      // Initially everyone is not matched
      int[] studentsUnis = new int[studentsCount];
      int[] unisStudents = new int[studentsCount];
      for (int i = 0; i < studentsCount; ++i) {
         studentsUnis[i] = unisStudents[i] = -1;
      }

      boolean flag = true;

      // Universities which are not matched keep proposing until they run out of applicants
      while (flag) {
         flag = false;
         for (int universityIndex = 0; universityIndex < unisStudents.length; ++universityIndex) {
            if (unisStudents[universityIndex] == -1 && !unisPreferences.get(universityIndex).isEmpty()) {
               flag = true;
               int studentIndex = unisPreferences.get(universityIndex).remove(unisPreferences.get(universityIndex).size() - 1);
               if (studentsUnis[studentIndex] == -1) {
                  assignStudentToUni(studentsUnis, unisStudents, studentIndex, universityIndex);
               } else if (studentPrefersUniMore(
                  studentsPreferences[studentIndex],
                  universityIndex,
                  studentsUnis[studentIndex]))
               {
                  unisStudents[studentsUnis[studentIndex]] = -1;
                  assignStudentToUni(studentsUnis, unisStudents, studentIndex, universityIndex);
               }
            }
         }
      }

      return studentsUnis;
   }

   private void assignStudentToUni(int[] studentsUnis, int[] unisStudents, int studentIndex, int universityIndex) {
      studentsUnis[studentIndex] = universityIndex;
      unisStudents[universityIndex] = studentIndex;
   }

   private boolean studentPrefersUniMore(int[] studentPreferences,  int currentUniIndex, int chosenUniIndex) {
      int currentIndex = Arrays.asList(studentPreferences).indexOf(currentUniIndex);
      int chosenIndex = Arrays.asList(studentPreferences).indexOf(chosenUniIndex);
      return currentIndex < chosenIndex;
   }

   private double[] calculatePayoffs(
      int studentsCount,
      double[] schoolsQuality,
      double[][] synergies,
      int[] studentsUnis) {

      // Students are rewarded with a point for every school they weakly prefer their result to
      double[] payoffs = new double[studentsCount];
      for (int studentIndex = 0; studentIndex < studentsCount; ++studentIndex) {
         if (studentsUnis[studentIndex] != -1) {
            double res = schoolsQuality[studentsUnis[studentIndex]] + synergies[studentIndex][studentsUnis[studentIndex]];
            for (int uni = 0; uni < schoolsQuality.length; ++uni) {
               if (schoolsQuality[uni] + synergies[studentIndex][uni] <= res) {
                  ++payoffs[studentIndex];
               }
            }
         }
      }

      for (int i = 0; i < payoffs.length; ++i) {
         payoffs[i] /= strategies.size();
      }

      return payoffs;
   }

   private static class StudentPair implements Comparable<StudentPair> {
      public StudentPair(int i, double q) {
         index = i;
         quality = q;
      }

      public int getIndex() {
         return index;
      }

      private int index;
      private double quality;

      public int compareTo(StudentPair n) { // sort by quality, then index
         int ret = Double.compare(quality, n.quality);
         return (ret == 0) ? (Integer.compare(index, n.index)) : ret;
      }
   }
}