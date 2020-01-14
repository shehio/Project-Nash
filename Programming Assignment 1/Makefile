# COS 445 SD1, Spring 2019
# Created by Andrew Wonnacott

.PHONY: all test clean
.DELETE_ON_ERROR:
all: Admissions.class

sd1.zip: Admissions.java AdmissionsConfig.java Makefile Student.java Student_holist.java Student_random.java Student_synergist.java Student_usnews.java Tournament.java students.txt
	zip sd1 Admissions.java AdmissionsConfig.java Makefile Student.java Student_holist.java Student_random.java Student_synergist.java Student_usnews.java Tournament.java students.txt

test: results.csv
	cat results.csv

results.csv: all students.txt
	java -Djava.util.Arrays.useLegacyMergeSort=true -ea Admissions students.txt > results.csv

Admissions.class: *.java
	javac -Xlint Admissions.java *.java

teams.csv:
	./get_teams_by_netid.py > teams.csv

#students.txt: Student_*.java
#	@touch students.txt
#	@while [[ `wc -l < students.txt` -lt 12 ]]; do 	ls | grep -e 'Student_.*\.java' | sed s/.*Student_// | sed s/\.java$$// >> students.txt; done

clean:
	rm -rf *.class sd1.zip #results.csv students.txt

#leaderboard:
#	rm -rf *.class results.csv students.txt Student_*.java ~/../htdocs/cos445/leaderboard_results.html
#	find /n/fs/tigerfile/Files/COS445_S2019/Strategy1Leaderboard/ -name '*.java' | xargs -i{} cp {} .
#	javac *.java
#	touch students.txt
#	while [[ `wc -l < students.txt` -lt 12 ]]; do 	ls Student_*.java | sed 's/.*Student_//' | sed 's/\.java//' >> students.txt; done
#	java -ea Admissions students.txt > results.csv
#	cat results.csv | awk -F , 'NR == 1; NR > 1 {print $0 | "sort -k 2 -t , -nr"}' | ./csv2html.py > ~/../htdocs/cos445/leaderboard_results.html
