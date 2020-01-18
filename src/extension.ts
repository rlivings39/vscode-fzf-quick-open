'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
let fzfTerminal: vscode.Terminal | undefined = undefined;
export const TERMINAL_NAME = "fzf terminal";

function showFzfTerminal(): vscode.Terminal {
	if (!fzfTerminal) {
		// Look for an existing terminal
		fzfTerminal = vscode.window.terminals.find((term) => { return term.name === TERMINAL_NAME; });
	}
	if (!fzfTerminal) {
		// Create an fzf terminal
		let cwd = vscode.workspace.getConfiguration('fzf-quick-open').get('initialWorkingDirectory') as string;

		if (!cwd && vscode.window.activeTextEditor) {
			cwd = path.dirname(vscode.window.activeTextEditor.document.fileName);
		}
		cwd = cwd || '';
		fzfTerminal = vscode.window.createTerminal({
			cwd: cwd,
			name: TERMINAL_NAME
		});
	}
	fzfTerminal.show();
	return fzfTerminal;
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('fzf-quick-open.runFzfFile', () => {
		let term = showFzfTerminal();
		term.sendText('fzf | xargs -r code', true);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('fzf-quick-open.runFzfAddWorkspaceFolder', () => {
		let term = showFzfTerminal();
		let findCmd = vscode.workspace.getConfiguration('fzf-quick-open').get('findDirectoriesCmd') as string;
		term.sendText(`${findCmd} | fzf | xargs -r code -a`, true);
	}));

	vscode.window.onDidCloseTerminal((terminal) => {
		if (terminal.name === TERMINAL_NAME) {
			fzfTerminal = undefined;
		}
	});
}

function colorText(text: string): string {
	let output = '';
	let colorIndex = 1;
	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);
		if (char === ' ' || char === '\r' || char === '\n') {
			output += char;
		} else {
			output += `\x1b[3${colorIndex++}m${text.charAt(i)}\x1b[0m`;
			if (colorIndex > 6) {
				colorIndex = 1;
			}
		}
	}
	return output;
}

function selectTerminal(): Thenable<vscode.Terminal | undefined> {
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
	return vscode.window.showQuickPick(items).then(item => {
		return item ? item.terminal : undefined;
	});
}

function ensureTerminalExists(): boolean {
	if ((<any>vscode.window).terminals.length === 0) {
		vscode.window.showErrorMessage('No active terminals');
		return false;
	}
	return true;
}