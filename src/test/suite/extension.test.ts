// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as vstest from '@vscode/test-electron';
import * as fzfQuickOpen from '../../extension'
import {suite} from 'mocha';
import {expect} from 'chai';

async function activateExtension() {
	let extension = vscode.extensions.getExtension('rlivings39.fzf-quick-open');
	expect(extension).not.eq(undefined);
	let res = await extension!.activate();
	expect(extension!.isActive, "Extension not activated").eq(true);
	return res;
}

async function verifyCommandsRegistered() {
	let cmds: string[] = await vscode.commands.getCommands();
	expect(cmds.indexOf('fzf-quick-open.runFzfFile')).not.eq(-1);
	expect(cmds.indexOf('fzf-quick-open.runFzfFilePwd')).not.eq(-1);
	expect(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolder')).not.eq(-1);
	expect(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolderPwd')).not.eq(-1);
	expect(cmds.indexOf('fzf-quick-open.runFzfSearch')).not.eq(-1);
	expect(cmds.indexOf('fzf-quick-open.runFzfSearchPwd')).not.eq(-1);
}

async function runCommandAndVerifyFzfTerminal(cmd: string, numterms: number, activeTerminalName: string) {
	await vscode.commands.executeCommand(cmd);
	expect(vscode.window.terminals.length, "Didn't find new terminal").eq(numterms);
	let fzfTermIdx = vscode.window.terminals.findIndex((term) => {
		return term.name === activeTerminalName;
	});
	expect(fzfTermIdx).gte(0, `Didn't find terminal ${activeTerminalName}`);
}

suite('fzf quick open uninit', async () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Commands not registered', () => {
		// Commands not yet present
		vscode.commands.getCommands().then((cmds) => {
		expect(cmds.indexOf('fzf-quick-open.runFzfFile')).eq(-1);
		expect(cmds.indexOf('fzf-quick-open.runFzfFilePwd')).eq(-1);
		expect(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolder')).eq(-1);
		expect(cmds.indexOf('fzf-quick-open.runFzfAddWorkspaceFolderPwd')).eq(-1);
		expect(cmds.indexOf('fzf-quick-open.runFzfSSearch')).eq(-1);
		expect(cmds.indexOf('fzf-quick-open.runFzfSearchPwd')).eq(-1);
		})
	});

	//activateExtension();

	test('Load extension', async () => {
		await activateExtension();
		await verifyCommandsRegistered();
	});

	test('Open file', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFile', vscode.window.terminals.length + 1, fzfQuickOpen.TERMINAL_NAME);
		await verifyCommandsRegistered();
	})

	test('Add workspace folder', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolder', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME)
		await verifyCommandsRegistered();
	})

	test('2 commands 1 terminal', async () => {
		// Make a test terminal for more coverage
		await vscode.window.createTerminal("Test terminal");
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFile', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME);
		// Calling 2nd command should reuse terminal
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolder', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME);
	});

	test('Open file pwd', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfFilePwd', vscode.window.terminals.length + 1, fzfQuickOpen.TERMINAL_NAME_PWD)
		await verifyCommandsRegistered();
	})

	test('Add workspace folder pwd', async () => {
		await runCommandAndVerifyFzfTerminal('fzf-quick-open.runFzfAddWorkspaceFolderPwd', vscode.window.terminals.length, fzfQuickOpen.TERMINAL_NAME_PWD)
		await verifyCommandsRegistered();
	})

	async function verifyRgConfig(opt: fzfQuickOpen.rgoptions, flag: string) {
		let settings = vscode.workspace.getConfiguration('fzf-quick-open');
		await settings.update('ripgrepSearchStyle', opt, vscode.ConfigurationTarget.Global);
		let testFlag = '--a-test-flag --other-test-flag';
		await settings.update('ripgrepOptions', testFlag, vscode.ConfigurationTarget.Global);
		let rgcmd = fzfQuickOpen.makeSearchCmd('pattern');
		let expectedFlag = fzfQuickOpen.rgflagmap.get(opt);
		expect(rgcmd).contains(expectedFlag);
		expect(rgcmd).contains(flag);
		expect(rgcmd).contains(testFlag);
	}

	// Make sure we respond to configuration changes when computing rg command
	test('Rg configuration', async () => {
		await verifyRgConfig(fzfQuickOpen.rgoptions.CaseSensitive, "--case-sensitive")
		await verifyRgConfig(fzfQuickOpen.rgoptions.IgnoreCase, "--ignore-case");
		await verifyRgConfig(fzfQuickOpen.rgoptions.SmartCase, "--smart-case");
	})
});
