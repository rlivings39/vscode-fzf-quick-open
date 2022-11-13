import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';
import { join } from 'path';
import * as process from 'process';

const NYC = require('nyc');

export async function run(): Promise<void> {
	const nyc = process.env.COVERAGE ? new NYC({
		cwd: join(__dirname, '..', '..', '..'),
		exclude: ['**/test/**', '.vscode-test/**'],
		include: ['**/src/*.ts','**/out/*.js'],
		extension: ['.ts'],
		reporter: ['text', 'html'],
		all: true,
		sourceMaps: true,
		instrument: true,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true}) : null;
	if (nyc) {
		await nyc.createTempDirectory()
	}

	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		timeout: 4000
	});
	mocha.options.color = true;

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(async failures => {
					if (nyc) {
						await nyc.writeCoverageFile()
						await nyc.report();
					}
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				e(err);
			}
		});
	});
}
