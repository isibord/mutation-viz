import * as vscode from 'vscode';
import { existsSync } from 'fs';

/**
 * Command name to run mutation framework according to config
 */
export const CommandName = 'extension.mutate';

/**
 * Name used to initialize new terminal for mutate command
 */
const mutationTerminal = 'Mutation Terminal';

export function mutate() {
    ensureTerminalExists();
    selectTerminal().then(terminal => {
        if (terminal) {
            terminal.show(true);
            terminal.sendText(`echo 'Generating mutants!'`);
            if (usingAnt()) {
                terminal.sendText(`ant mutate`);
            }
            else if (usingMaven()) {
                // TODO read other frameworks from config (as in parser.ts)
                const mutationFramework: string = 'PIT';
                let mvnCmd = "";
                if(mutationFramework === 'PIT'){
                    mvnCmd = `mvn org.pitest:pitest-maven:mutationCoverage -DreportsDirectory=${vscode.workspace.getConfiguration().get('mutation.outputFolder')}` +
                        ` -DwithHistory -DoutputFormats=xml -DtimestampedReports=false`;
                }
                terminal.sendText(mvnCmd);
            }
        }
    });
}

/**
 * Ensures the mutation terminal exists. If it doesn't exist, create one.
 */
function ensureTerminalExists() {
	if ((<any>vscode.window).terminals.length === 0) {
		vscode.window.createTerminal(mutationTerminal);
	}
}

/**
 * Select terminal for mutate command
 */
export function selectTerminal(): Thenable<vscode.Terminal | undefined> {
	interface TerminalQuickPickItem extends vscode.QuickPickItem {
		terminal: vscode.Terminal;
	}
	const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
	const items: TerminalQuickPickItem[] = terminals.map(t => {
		return {
			label: `name: ${t.name}`,
			terminal: t
		};
	});
	
	vscode.window.showInformationMessage('Select your terminal!');
	return vscode.window.showQuickPick(items).then(item => {
		return item ? item.terminal : undefined;
	});
}

/**
 * Determines if the current project is built with ant
 */
function usingAnt() : boolean {
	return existsSync(vscode.workspace.rootPath + '/build.xml');
}

/**
 * Determines if the current project is built with maven
 */
function usingMaven() : boolean {
	return existsSync(vscode.workspace.rootPath + '/pom.xml');
}
