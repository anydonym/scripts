// deno-lint-ignore-file no-explicit-any
import * as colors from 'https://deno.land/std@0.123.0/fmt/colors.ts';

export default class Logger {
	options: Required<LoggerOptions>;

	constructor(options?: LoggerOptions) {
		Deno.stdout.write(new TextEncoder().encode('\n'));

		this.options = Object.assign(
			<Required<LoggerOptions>> {
				'name': 'logger',
				'levels': {
					'log': {
						'level': colors.blue('log'),
						'type': 'output',
					},
					'info': {
						'level': colors.cyan('info'),
						'type': 'output',
					},
					'warn': {
						'level': colors.yellow('warn'),
						'type': 'output',
					},
					'severe': {
						'level': colors.red('severe'),
						'type': 'error',
						'manipulator': ((prefix, output) => prefix + colors.yellow(output)),
					},
					'fatal': {
						'level': colors.brightRed('fatal'),
						'type': 'error',
						'manipulator': ((prefix, output) => prefix + colors.red(output)),
					},
				},
				'output': 'standard',
			},
			options ?? {},
		);
	}

	#write(string: string, type: 'output' | 'error' = 'output') {
		if (this.options.output == 'console') {
			console.log(string);
		} else if (Deno) {
			if (type == 'output') {
				Deno.stdout.writeSync(new TextEncoder().encode(string + '\n'));
			} else if (type == 'error') {
				Deno.stderr.writeSync(new TextEncoder().encode(string + '\n'));
			}
		}
	}

	#build(level: string) {
		return `${colors.dim(`[${new Date().toISOString()}]`)} ${
			colors.bold(this.options.name ? this.options.name + ' ' : '')
		} ${level} » `;
	}

	log<Level extends keyof typeof this.options.levels>(logging_level: Level, ...output: any[]) {
		const level = this.options.levels![logging_level];
		this.#write(
			(level.manipulator ?? ((a: string, b: string) => a + b))(
				this.#build(level.level ?? logging_level),
				output.join(' '),
			),
			level.type,
		);
	}
}

export interface LoggerOptions {
	name?: string;
	levels?: Record<
		string,
		{
			level?: string;
			manipulator?: ((prefix: string, output: string) => string);
			type?: 'output' | 'error';
		}
	>;
	output?: 'console' | 'standard';
}

export { colors };
