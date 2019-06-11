import * as vscode from "vscode";
import * as assert from "assert";
import * as sinon from "sinon";
import * as fs from "fs";

// IMPORTANT: We require that launch.json will open /harness-ant for these tests
suite("Extension Tests", function() {
    this.timeout(25000);

    test(`
        Run the extension.mutate command;
        Check that mutations.xml was read from file.
        Check that a webview panel was created.
        Check that status bar has created.
        Check that a terminal window was created.
        `,
    async () => {
        const extension = await setup();
        const readFileSyncSpy = sinon.spy(fs, "readFileSync");
        const createWebviewPanelSpy = sinon.spy(vscode.window, "createWebviewPanel");
        const createStatusBarItemSpy = sinon.spy(vscode.window, "createStatusBarItem");
        const createTerminalWindowSpy = sinon.spy(vscode.window, "createTerminal");
        await vscode.commands.executeCommand("extension.mutate");
        await sleep(2000);

        // check that we read the mutations file
        sinon.assert.calledWith(readFileSyncSpy, sinon.match(/harness-ant\/mutationReports\/mutations.xml/));

        // check that webview panel was created
        sinon.assert.calledWith(createWebviewPanelSpy, 
            "welcomePanel", "Mutation Viz Summary", vscode.ViewColumn.One, { enableScripts: true }
        );

        // check for status bar and that it has the correct command
        sinon.assert.calledWith(createStatusBarItemSpy, vscode.StatusBarAlignment.Right, 100);
        assert.strictEqual(extension.exports.myStatusBarItem.command, "ToggleDecorations");

        // check that terminal window was created
        sinon.assert.calledOnce(createTerminalWindowSpy);
        assert.strictEqual(createTerminalWindowSpy.args[0][0], "Mutation Terminal");
    });

    test(`
        Run the extension.mutate command;
        Open the Triangle.java file, close it, and reopen it
        `,
    async () => {
        const extension = await setup();
        const createTerminalWindowSpy = sinon.spy(vscode.window, "createTerminal");
        const createDecorationTypeSpy = sinon.spy(vscode.window, "createTextEditorDecorationType");
        await vscode.commands.executeCommand("extension.mutate");
        await sleep(2000);

        // Find the triangle file, and open it
        const triangleFile = await vscode.workspace.findFiles("**/src/com/triangle/Triangle.java");
        const triangleDocument = await vscode.workspace.openTextDocument(triangleFile[0]);
        const triangleFileEditorWindow = await vscode.window.showTextDocument(triangleDocument);
        const triangleFileEditorWindowSpy = sinon.spy(triangleFileEditorWindow, "setDecorations");
        await sleep(2000);

        // Close and reopen the triangle editor
        await vscode.window.showTextDocument(triangleDocument);
        await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        await sleep(2000);
        await vscode.window.showTextDocument(triangleDocument);
        await sleep(5000);

        // check that the Triangle file is in the active view column
        assert.strictEqual(triangleFileEditorWindow.viewColumn, vscode.ViewColumn.One);
    });

    test(`
        Run the extension.mutate command;
        Execute miscallaneous UI commands and ensure we don't crash;
        `,
    async () => {
        const extension = await setup();
        await vscode.commands.executeCommand("extension.mutate");
        await sleep(2000);

        // Find the triangle file, and open it
        const triangleFile = await vscode.workspace.findFiles("**/src/com/triangle/Triangle.java");
        const triangleDocument = await vscode.workspace.openTextDocument(triangleFile[0]);
        const triangleFileEditorWindow = await vscode.window.showTextDocument(triangleDocument);
        await sleep(2000);

        await vscode.commands.executeCommand("editorScroll", { to: "down", by: "line", value: 20 });
        await sleep(1000);
        await vscode.commands.executeCommand("editorScroll", { to: "up", by: "line", value: 10 });
        await sleep(1000);
        await vscode.commands.executeCommand("editor.fold", { levels: 1, direction: "up" });
        await sleep(1000);
        await vscode.commands.executeCommand("editor.fold", { levels: 1, direction: "down" });
   });

    this.afterEach(() => {
        sinon.restore();
    });

    // Set up each integration test by opening the harness project and running the extension.
    // Can't use beforeEach hook because of how the environment gets setup.
    // Returns a reference to the extension
    const setup = async () => {
        // wait for testing IDE to load up
        await sleep(2000);

        if (vscode.workspace.workspaceFolders === undefined) {
            throw new Error("Workspace did not open harness project. Integration test cannot proceed.");
        }
        assert.strictEqual(vscode.workspace.workspaceFolders.length, 1);
        assert.strictEqual(vscode.workspace.workspaceFolders[0].name, "harness-ant"); // This is hardcoded in launch.json and package.json

        // get mutation-viz extension
        const extension = await vscode.extensions.getExtension("cse590.mutation-viz");
        if (!extension) {
            throw new Error("Extension failed to load. Integration test cannot proceed.");
        }
        return extension;
    };
});

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
