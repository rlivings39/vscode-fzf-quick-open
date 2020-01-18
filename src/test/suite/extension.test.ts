import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as fzfQuickOpen from '../../extension'

function activateExtension() {
	let extension = vscode.extensions.getExtension('rlivings39.fzf-quick-open');
	assert.notEqual(extension, undefined);

	return extension!.activate().then(async () => {
		assert.equal(extension!.isActive, true, "Extension not activated");
	});
}

async function verifyCommandsRegistered() {
	let cmds: string[] = await vscode.commands.getCommands();
	assert.notEqual(cmds.indexOf('fzf-quick-open.runFzfFile'), -1);
	assert.notEqual(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolder'), -1);
}

function runCommandAndVerifyFzfTerminal(cmd: string, numterms: number) {
	return vscode.commands.executeCommand(cmd).then(() => {
		assert.equal(vscode.window.terminals.length, numterms, "Didn't find new terminal");
		let fzfTerms = vscode.window.terminals.filter((term) => {
			term.name === fzfQuickOpen.TERMINAL_NAME;
		});
		assert.equal(fzfTerms.length, 1, "Didn't find 1 fzf terminal open");
	});
}

suite('fzf quick open', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Commands not registered', async () => {
		// Commands not yet present
		let cmds: string[] = await vscode.commands.getCommands();
		assert.equal(cmds.indexOf('fzf-quick-open.runFzfFile'), -1);
		assert.equal(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolder'), -1);
	});

	test('Load extension', () => {
		activateExtension().then(() => {
			verifyCommandsRegistered();
		})
	});

	test('Open file', () => {
		runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFile', vscode.window.terminals.length+1).then(verifyCommandsRegistered);
	})

	test('Add workspace folder', () => {
		runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolder', vscode.window.terminals.length+1).then(verifyCommandsRegistered);
	})

	test('2 commands 1 terminal', () => {
		runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFile', vscode.window.terminals.length+1);
		// Calling 2nd command should reuse terminal
		runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolder', vscode.window.terminals.length);
	});
});
