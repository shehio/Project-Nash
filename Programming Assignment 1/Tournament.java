// Shared code for all Strategy Design Assignments
// COS 445 Spring 2019
// Created by Andrew Wonnacott

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public abstract class Tournament<Strategy, Config> {
  static final Random rand = new Random();
  static final ExecutorService service =
      Executors.newCachedThreadPool(
          (Runnable r) -> {
            Thread t = new Thread(r);
            t.setDaemon(true);
            return t;
          });

  static <T> T runWithTimeout(String error, Callable<T> task, int msTimeout) {
    T ret = null;
    Future<T> future = service.submit(task);
    try {
      return future.get(msTimeout, TimeUnit.MILLISECONDS);
    } catch (TimeoutException | InterruptedException | ExecutionException e) {
      future.cancel(true);
      throw new RuntimeException(error, e);
    }
  }

  final List<Class<? extends Strategy>> strategies;

  Tournament(Class<Strategy> clazz, List<String> strategyNames) {
    List<Class<? extends Strategy>> strategies = new ArrayList<>();
    for (String name : strategyNames) {
      try {
        strategies.add(Class.forName(name).asSubclass(clazz));
      } catch (ReflectiveOperationException roe) {
        throw new RuntimeException(roe);
      }
    }
    this.strategies = Collections.unmodifiableList(strategies);
  }

  public double[] oneEachTrials(int numTrials, Config config) {
    double[] res = new double[strategies.size()];

    for (int i = 0; i < strategies.size(); ++i) {
      res[i] = 0;
    }
    for (int ign = 0; ign < numTrials; ++ign) {
      double[] ret = runTrial(this.strategies, config);
      for (int i = 0; i < strategies.size(); ++i) {
        res[i] += ret[i];
      }
    }
    for (int i = 0; i < strategies.size(); ++i) {
      res[i] /= numTrials;
    }

    return res;
  }

  public <Strategy_T extends Strategy> double[] withExtraTrials(
      Class<Strategy_T> clazz, int numTrials, Config config) {
    double[] res = new double[strategies.size() + 1];

    for (int i = 0; i < strategies.size() + 1; ++i) {
      res[i] = 0;
    }
    for (int ign = 0; ign < numTrials; ++ign) {
      double[] ret = withExtraTrial(clazz, config);
      for (int i = 0; i < strategies.size() + 1; ++i) {
        res[i] += ret[i];
      }
    }
    for (int i = 0; i < strategies.size() + 1; ++i) {
      res[i] /= numTrials;
    }

    return res;
  }

  public <Strategy_T extends Strategy> double[] withExtraTrial(
      Class<Strategy_T> clazz, Config config) {
    // Initialize students
    List<Class<? extends Strategy>> withExtraStrategies = new ArrayList<>(strategies);
    withExtraStrategies.add(clazz);
    return runTrial(withExtraStrategies, config);
  }

  public <Strategy_T extends Strategy> double[] withReplacementTrials(
      Class<Strategy_T> clazz, int numTrials, Config config) {
    double[] res = new double[strategies.size()];
    for (int i = 0; i < strategies.size(); ++i) {
      res[i] = withReplacementTrials(clazz, numTrials, config, i);
    }
    return res;
  }

  private <Strategy_T extends Strategy> double withReplacementTrials(
      Class<Strategy_T> clazz, int numTrials, Config config, int i) {
    double res = 0;
    for (int ign = 0; ign < numTrials; ++ign) {
      res += withReplacementTrial(clazz, config, i);
    }
    res /= numTrials;
    return res;
  }

  private <Strategy_T extends Strategy> double withReplacementTrial(
      Class<Strategy_T> clazz, Config config, int i) {
    // Initialize students
    List<Class<? extends Strategy>> withExtraStrategies = new ArrayList<>(strategies);
    withExtraStrategies.set(i, clazz);
    return runTrial(withExtraStrategies, config)[i];
  }

  public <Strategy_T extends Strategy> double bySelfTrials(
      Class<Strategy_T> clazz, int numTrials, int numStrategies, Config config) {
    double sum = 0;
    for (int i = 0; i < numTrials; ++i) {
      sum += bySelfTrial(clazz, numStrategies, config);
    }
    return sum / numTrials;
  }

  public <Strategy_T extends Strategy> double bySelfTrial(
      Class<Strategy_T> clazz, int numStrategies, Config config) {
    List<Class<? extends Strategy>> studentClasses = new ArrayList<>();
    for (int i = 0; i < numStrategies; ++i) {
      studentClasses.add(clazz);
    }

    return Arrays.stream(runTrial(studentClasses, config)).average().getAsDouble();
  }

  public abstract double[] runTrial(List<Class<? extends Strategy>> strategies, Config config);
}
