// Student.java: interface for Student
// COS 445 HW1, Spring 2018
// Created by Andrew Wonnacott

import java.util.List;

public interface Student {
  // Given the stats of this simulation, output which schools to apply to
  // aptitude is drawn from U[0, S]
  // schools are drawn from U[0, T] and are passed in monotonically decreasing order of quality
  // synergies are drawn from U[0, W]
  // schools.length == synergies.length == N >= 10
  // Return the indicies of the schools to which you want to apply.
  // Return value `ret` must hold:
  // * ret.length == 10 and the elements of ret are all different
  // * forall school in ret, 0 <= school < schools.length
  public int[] getApplications(
          int N,
          double S,
          double T,
          double W,
          double aptitude,
          List<Double> schools,
          List<Double> synergies);
}
