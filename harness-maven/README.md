# pitest ant triangle test build

This is our harness project to build our plug in from

Build and run tests with "mvn test"

Run PIT with "mvn org.pitest:pitest-maven:mutationCoverage -DwithHistory -DreportsDirectory=mutationReports -DoutputFormats=xml -DtimestampedReports=false"

If you modify the java classes, run the above mvn command and check in the new mutations.xml along with your changes
