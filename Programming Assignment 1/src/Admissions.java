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

<<<<<<< HEAD
  // Sets the the random variables: aptitudes, schools, and synergies.
=======
>>>>>>> More refactoring...
  public double[] runTrial(List<Class<? extends Student>> strategies, AdmissionsConfig config) {
    // config might randomize each time
    final double S = config.getS();
    final double T = config.getT();
    final double W = config.getW();

    List<Student> students = new ArrayList<Student>();
    for (Class<? extends Student> studentClass : strategies) {
      try {
        students.add(studentClass.getDeclaredConstructor().newInstance());
      } catch (ReflectiveOperationException roe) {
        throw new RuntimeException(roe);
      }
    }

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

    // Get each student's choices of schools to which to apply
    int[][] studentsPreferences = new int[students.size()][];
    PrintStream stdout = System.out;
    System.setOut(new PrintStream(OutputStream.nullOutputStream()));
<<<<<<< HEAD

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
              students.size(),
              studentsPreferences[studentIndex],
              students.get(studentIndex).getClass().getSimpleName());
=======
    for (int stu = 0; stu < studentsPreferences.length; ++stu) {
      // System.err.println(students.get(stu).getClass().getSimpleName());
      // really gross boxing code
      studentsPreferences[stu] =
              students
                      .get(stu)
                      .getApplications(
                              students.size(),
                              S,
                              T,
                              W,
                              aptitudes[stu],
                              Collections.unmodifiableList(
                                      DoubleStream.of(schoolsQuality).boxed().collect(Collectors.toList())),
                              Collections.unmodifiableList(
                                      DoubleStream.of(synergies[stu]).boxed().collect(Collectors.toList())));
      checkLegalStuPrefs(
              students.size(), studentsPreferences[stu], students.get(stu).getClass().getSimpleName());
>>>>>>> More refactoring...
    }

    System.setOut(stdout);

    // Build university preference lists filtered by applications
    ArrayList<TreeSet<StudentPair>> uniPrefTrees = new ArrayList<TreeSet<StudentPair>>();
    for (int uni = 0; uni < schoolsQuality.length; ++uni) {
      uniPrefTrees.add(new TreeSet<StudentPair>());
    }
<<<<<<< HEAD

    for (int studentIndex = 0; studentIndex < studentsPreferences.length; ++studentIndex) {
      for (int uni : studentsPreferences[studentIndex]) {
        uniPrefTrees.get(uni).add(new StudentPair(studentIndex, aptitudes[studentIndex] + synergies[studentIndex][uni]));
=======
    for (int studentIndex = 0; studentIndex < studentsPreferences.length; ++studentIndex) {
      for (int university : studentsPreferences[studentIndex]) {
        uniPrefTrees.get(university).add(new StudentPair(studentIndex, aptitudes[studentIndex] + synergies[studentIndex][university]));
>>>>>>> More refactoring...
      }
    }

    ArrayList<ArrayList<Integer>> uniPrefs = new ArrayList<ArrayList<Integer>>();
    for (TreeSet<StudentPair> prefTree : uniPrefTrees) {
      uniPrefs.add(
              prefTree.stream()
                      .map(StudentPair::getIndex)
                      .collect(Collectors.toCollection(ArrayList::new)));
    }

    // Initially everyone is not matched
    int[] stuUnis = new int[students.size()];
    int[] uniStus = new int[students.size()];
    for (int i = 0; i < students.size(); ++i) {
      stuUnis[i] = uniStus[i] = -1;
    }

    boolean flag = true;

    // Universities which are not matched keep proposing until they run out of applicants
    while (flag) {
      flag = false;
      for (int universityIndex = 0; universityIndex < schoolsQuality.length; ++universityIndex) {
        if (uniStus[universityIndex] == -1 && !uniPrefs.get(universityIndex).isEmpty()) {
          flag = true;
<<<<<<< HEAD
          int studentIndex = uniPrefs.get(universityIndex).remove(uniPrefs.get(universityIndex).size() - 1);
          if (stuUnis[studentIndex] == -1) {
            stuUnis[studentIndex] = universityIndex;
            uniStus[universityIndex] = studentIndex;
          } else if (Arrays.asList(studentsPreferences[studentIndex]).indexOf(universityIndex)
              < Arrays.asList(studentsPreferences[studentIndex]).indexOf(stuUnis[studentIndex])) {
            uniStus[stuUnis[studentIndex]] = -1;
            stuUnis[studentIndex] = universityIndex;
            uniStus[universityIndex] = studentIndex;
=======
          int stu = uniPrefs.get(universityIndex).remove(uniPrefs.get(universityIndex).size() - 1);
          if (stuUnis[stu] == -1) {
            stuUnis[stu] = universityIndex;
            uniStus[universityIndex] = stu;
          } else if (Arrays.asList(studentsPreferences[stu]).indexOf(universityIndex)
                  < Arrays.asList(studentsPreferences[stu]).indexOf(stuUnis[stu])) {
            uniStus[stuUnis[stu]] = -1;
            stuUnis[stu] = universityIndex;
            uniStus[universityIndex] = stu;
            int studentIndex = uniPrefs.get(universityIndex).remove(uniPrefs.get(universityIndex).size() - 1);
            if (stuUnis[studentIndex] == -1) {
              stuUnis[studentIndex] = universityIndex;
              uniStus[universityIndex] = studentIndex;
            } else if (Arrays.asList(studentsPreferences[studentIndex]).indexOf(universityIndex)
                    < Arrays.asList(studentsPreferences[studentIndex]).indexOf(stuUnis[studentIndex])) {
              uniStus[stuUnis[studentIndex]] = -1;
              stuUnis[studentIndex] = universityIndex;
              uniStus[universityIndex] = studentIndex;
            }
>>>>>>> More refactoring...
          }
        }
      }

      // Students are rewarded with a point for every school they weakly prefer their result to
      double[] payoff = new double[students.size()];
      for (int studentIndex = 0; studentIndex < students.size(); ++studentIndex) {
        if (stuUnis[studentIndex] != -1) {
          double res = schoolsQuality[stuUnis[studentIndex]] + synergies[studentIndex][stuUnis[studentIndex]];
          for (int uni = 0; uni < schoolsQuality.length; ++uni) {
            if (schoolsQuality[uni] + synergies[studentIndex][uni] <= res) {
              ++payoff[studentIndex];
            }
          }
        }
      }

      for (int i = 0; i < payoff.length; ++i) {
        payoff[i] /= strategies.size();
      }
      return ret;
    }
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
    // each strategy in the sample room with the sample strategies (not a component of the grade,
    // just for overfitting comparisons)
    final Admissions withStrategies = new Admissions(strategyNames);

    double[] res = withStrategies.oneEachTrials(numTrials, config);
    System.out.println("netID,score");
    for (int i = 0; i != N; ++i) {
      System.out.println(strategyNames.get(i).substring(8) + "," + Double.toString(res[i]));
    }
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
