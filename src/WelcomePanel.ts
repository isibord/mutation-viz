import * as vscode from 'vscode';
import { MutationReportParser, MutationReport } from './parser';

/**
 * This method is called when the extension is activated. The extension is activated the very first time the command is executed
 * Welcome Panel gives user a holistic view of the mutation test analysis.
 * @param context VSCode Extension context
 * @param report Mutation Report to get analysus
 */
export function activate(context: vscode.ExtensionContext, report: MutationReport) {
    // Ensure Welcome Panel is a Singleton
    const currentPanel = vscode.window.createWebviewPanel(
        'welcomePanel',
        'Mutation Viz Summary',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    // Set Panel's HTML Content
    currentPanel.webview.html = getWebviewContent(report);
    
    // Define Panel's Behavior When Closed
    currentPanel.onDidDispose(() => {
        console.log("Mutation Viz welcome panel closed.");
    });

    return currentPanel;
}

/**
 * Get full content of the webview to be displayed.
 * @param report Mutation Report to generate content from
 */
export function getWebviewContent(report: MutationReport) {
    let listOfMutationsHtml = `
        <tr>
            <th id="sort_by_status">Status</th>
            <th id="sort_by_mutated_method">Mutated Method</th>
            <th id="sort_by_mutator">Mutator</th>
            <th id="sort_by_description">Mutation Description</th>
            <th id="sort_by_line">Source Code Line</th>
        </tr>
    `;
    report.mutations.forEach(element => {
        listOfMutationsHtml += `<tr>
            <td class="${element.status.toLowerCase()}">${element.status}</td>
            <td>${element.mutatedMethod}</td>
            <td>${getWordAfterLastPeriod(element.mutator)}</td>
            <td>${element.mutatorDescription}</td>
            <td>${element.sourceFile}:${element.lineNumber}</td>
        </tr>`;
    });

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
                <style>${getWebviewStylesheet()}</style>
            </head>
            <body>
                <h2>Total Mutants Generated: ${report.mutationSummary.overallSummary.totalMutationCount}</h2>
                <h2>Total Mutants Killed: ${report.mutationSummary.overallSummary.killedMutationCount}</h2>
                <h2>Total Mutants Survived: ${report.mutationSummary.overallSummary.livedMutationCount}</h2>
                <p id="load_msg">Please wait... Sorting table...</p>
                <table id="main">
                    ${listOfMutationsHtml}
                </table>
                ${getWebviewJavascript()}
            </body>
        </html>
    `;
}


/**
 * Gets the last word after the last period in a phrase
 * For example, if the word is com.triangle.Triangle, return "Triangle"
 * @param phrase The full phrase to get word after last period
 */
export function getWordAfterLastPeriod(phrase : string){
    return phrase.slice(phrase.lastIndexOf(".") + 1, phrase.length);		
}
/**
 * Get Javascript for webview
 */
export function getWebviewJavascript() {
    return `
        <script>
            document.getElementById("load_msg").style.visibility = "hidden";
            document.getElementById("sort_by_status").addEventListener("click", () => sortTable(0), false);
            document.getElementById("sort_by_mutated_method").addEventListener("click", () => sortTable(1), false);
            document.getElementById("sort_by_mutator").addEventListener("click", () => sortTable(2), false);
            document.getElementById("sort_by_description").addEventListener("click", () => sortTable(3), false);
            document.getElementById("sort_by_line").addEventListener("click", () => sortTable(4), false);
            
            function sortTable(tdIndex) {
                var table, rows, switching, i, x, y, shouldSwitch;
                table = document.getElementById("main");
                table.style.visibility = "hidden";
                document.getElementById("load_msg").style.visibility = "visible";
                switching = true;

                setTimeout(() => {
                    while (switching) {
                        switching = false;
                        rows = table.rows;
                        // Loop through all table rows (except the first, which contains table headers)
                        for (i = 1; i < (rows.length - 1); i++) {
                            shouldSwitch = false;
                            x = rows[i].getElementsByTagName("TD")[tdIndex];
                            y = rows[i + 1].getElementsByTagName("TD")[tdIndex];
                            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                                shouldSwitch = true;
                                break;
                            }
                        }
                        if (shouldSwitch) {
                            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                            switching = true;
                        }
                    }
                    document.getElementById("load_msg").style.visibility = "hidden";
                    table.style.visibility = "visible";
                }, 100)
            }
        </script>
    `;
}

/**
 * Get stylesheet for the webview
 */
export function getWebviewStylesheet() {
    return `
        th, td {
            text-align: left;
        }

        td {
            padding: 2px;
        }
        
        td.killed {
            color: var(--vscode-gitDecoration-addedResourceForeground);
        }
        
        td.survived {
            color: var(--vscode-editorError-foreground);
        }

        th:hover {
            cursor: pointer;
            text-decoration: underline;
        }

        table.hidden {
            display: none;
        }
    `;
}