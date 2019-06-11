import * as vscode from 'vscode';
import { existsSync } from "fs";
import * as assert from 'assert';
import { MutationReportParser, MutationSummary } from "../parser";

test('Test report generation by vaildating summary', () => {
    const TEST_PIT_XML_PATH = 'src/test/test-pit-output.xml';
    if (!existsSync(TEST_PIT_XML_PATH)) {
        // TODO fix file references to be consistent between command line and IDE.
        console.warn('Test file not found. Try running from command line with `npm test` instead.');
        return;
    }
    let report = new MutationReportParser('src/test/test-pit-output.xml');
    let actualMutationSummary: MutationSummary = report.getMutationReport().mutationSummary;

    assert.equal(19, actualMutationSummary.overallSummary.totalMutationCount);
    assert.equal(9, actualMutationSummary.overallSummary.killedMutationCount);
    assert.equal(10, actualMutationSummary.overallSummary.livedMutationCount);

    let fileLevelTotalCount = 0;
    let fileLevelKilledCount = 0;
    let fileLevelLivedCount = 0;
    for (const entry of actualMutationSummary.fileLevelSummary.entries()) {
        fileLevelTotalCount = fileLevelTotalCount + entry[1].totalMutationCount;
        fileLevelKilledCount = fileLevelKilledCount + entry[1].killedMutationCount;
        fileLevelLivedCount = fileLevelLivedCount + entry[1].livedMutationCount;
    }

    assert.equal(19, fileLevelTotalCount);
    assert.equal(9, fileLevelKilledCount);
    assert.equal(10, fileLevelLivedCount);
});

test('Test major parsing', () => {
    const TEST_ANT_HARNESS_CSV_PATH = 'harness-ant/major/summary.csv';
    if (!existsSync(TEST_ANT_HARNESS_CSV_PATH)) {
        // TODO fix file references to be consistent between command line and IDE.
        console.warn('Test file not found. Try running from command line with `npm test` instead.');
        return;
    }
    let report = new MutationReportParser(TEST_ANT_HARNESS_CSV_PATH, 'MAJOR');
    let actualMutationSummary: MutationSummary = report.getMutationReport().mutationSummary;

    assert.equal(86, actualMutationSummary.overallSummary.totalMutationCount);
    assert.equal(76, actualMutationSummary.overallSummary.killedMutationCount);
    assert.equal(10, actualMutationSummary.overallSummary.livedMutationCount);

    assert.equal(0, report.getMutations().length);
});
