import * as WelcomePanel from "../WelcomePanel";
import { MutationReportParser, MutationCounts } from "../parser";
import * as assert from 'assert';

test("Test implements activate function", function () {
    assert.equal(typeof WelcomePanel.activate, 'function');
});

test("Test webview content is html", function() {
    const mutationReport = {
        mutations: [],
        mutationSummary: {
            fileLevelSummary: new Map<string, MutationCounts>(),
            overallSummary: {
                totalMutationCount: 10,
                killedMutationCount: 10,
                livedMutationCount: 10
            }
        }
    };
    let webviewContent = WelcomePanel.getWebviewContent(mutationReport);
    assert.equal(webviewContent.includes('<!DOCTYPE html>'), true);
    assert.equal(webviewContent.includes('<html lang="en">'), true);
    assert.equal(webviewContent.includes("</html>"), true);
});

test("Test get word after last period", function () {
    assert.strictEqual(WelcomePanel.getWordAfterLastPeriod("com.triangle.Triangle"), 'Triangle');
});

test("Test get webview stylesheet contains table styling", function () {
    assert.equal(WelcomePanel.getWebviewStylesheet().includes('td'), true);
});

test("Test get webview javascript contains tags", function () {
    assert.equal(WelcomePanel.getWebviewJavascript().includes('script'), true);
    assert.equal(WelcomePanel.getWebviewJavascript().includes('document.getElementById'), true);
    assert.equal(WelcomePanel.getWebviewJavascript().includes('function sortTable'), true);
});
