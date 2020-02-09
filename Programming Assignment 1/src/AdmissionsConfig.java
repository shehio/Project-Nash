// COS 445 SD1, Spring 2019
// Created by Andrew Wonnacott

public class AdmissionsConfig {
  protected double _S;
  protected double _T;
  protected double _W;

  public AdmissionsConfig(double S, double T, double W) {
    _S = S;
    _T = T;
    _W = W;
  }

  public double getS() {
    return _S;
  }

  public double getT() {
    return _T;
  }

  public double getW() {
    return _W;
  }
}
