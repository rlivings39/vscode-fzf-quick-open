import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as fzfQuickOpen from '../../extension'
import {suite} from 'mocha';
import {expect} from 'chai';

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
	assert.notEqual(cmds.indexOf('fzf-quick-open.runFzfFilePwd'), -1);
	assert.notEqual(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolder'), -1);
	assert.notEqual(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolderPwd'), -1);
}

async function runCommandAndVerifyFzfTerminal(cmd: string, numterms: number, activeTerminalName: string) {
	await vscode.commands.executeCommand(cmd);
	assert.equal(vscode.window.terminals.length, numterms, "Didn't find new terminal");
	let fzfTermIdx = vscode.window.terminals.findIndex((term) => {
		return term.name === activeTerminalName;
	});
	expect(fzfTermIdx).gte(0, `Didn't find terminal ${activeTerminalName}`);
}

suite('fzf quick open', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Commands not registered', async () => {
		// Commands not yet present
		let cmds: string[] = await vscode.commands.getCommands();
		assert.equal(cmds.indexOf('fzf-quick-open.runFzfFile'), -1);
		assert.equal(cmds.indexOf('fzf-quick-open.runFzfFilePwd'), -1);
		assert.equal(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolder'), -1);
		assert.equal(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolderPwd'), -1);
	});

	test('Load extension', () => {
		activateExtension().then(() => {
			verifyCommandsRegistered();
		})
	});

	test('Open file', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFile', vscode.window.terminals.length + 1, fzfQuickOpen.TERMINAL_NAME);
		verifyCommandsRegistered();
	})

	test('Add workspace folder', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolder', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME)
		verifyCommandsRegistered();
	})

	test('2 commands 1 terminal', async () => {
		// Make a test terminal for more coverage
		await vscode.window.createTerminal("Test terminal");
		runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFile', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME);
		// Calling 2nd command should reuse terminal
		runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolder', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME);
	});

	test('Open file pwd', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFilePwd', vscode.window.terminals.length + 1, fzfQuickOpen.TERMINAL_NAME_PWD)
		verifyCommandsRegistered();
	})

	test('Add workspace folder pwd', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolderPwd', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME_PWD)
		verifyCommandsRegistered();
	})
});
