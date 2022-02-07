// deno-lint-ignore-file no-explicit-any
import * as colors from 'https://deno.land/std@0.123.0/fmt/colors.ts';

/**
 * The Logger class.
 */
export default class Logger {
	private options: Required<LoggerOptions>;

	/**
	 * Constructs a new Logger instance.
	 * @param options The options to configure the Logger with.
	 */
	constructor(options?: LoggerOptions) {
		this.options = Object.assign({
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
			'output': 'console',
		} as Required<LoggerOptions>, options ?? {});
	}

	/**
	 * Write the specified content to the desired output.
	 * @param string The string to output.
	 */
	#write(string: string): void {
		if (this.options.output == 'console') {
			console.log(string);
		} else if (this.options.output == 'stdout') {
			Deno.stdout.write(new TextEncoder().encode(string + '\n'));
		}
	}

	/**
	 * Builds the prefix for the logging message.
	 * @param level The level to log.
	 * @returns The prefix.
	 */
	#build(level: string): string {
		return `${colors.dim(`[${new Date().toISOString()}]`)} ${
			colors.bold(this.options.name ? this.options.name + ' ' : '')
		} ${level} | `;
	}

	/**
	 * Prints a log of the specified logging level to the desired output with the specified parameters.
	 * @param logging_level The level to log.
	 * @param output The content to output.
	 */
	log(logging_level: keyof typeof this.options.levels, ...output: any[]): void {
		const level = this.options.levels![logging_level];
		if (level) {
			this.#write(
				(level.manipulator ?? ((a: string, b: string) => a + b))(
					this.#build(level.level ?? logging_level),
					output.join(' '),
				),
			);
		} else this.#write(this.#build('output') + output.join(' '));
	}

	/**
	 * Get Deno `std` implementatin of colors.
	 * @returns The colors library.
	 */
	get colors(): typeof colors {
		return colors;
	}
}

/**
 * The options to configure the Logger with.
 */
export interface LoggerOptions {
	/** The name for the Logger. Can be empty, in which case `logger` will be used as the name. */
	name?: string;
	/** The levels and their respective preformatted level tag and the manipulator function, allowing direct manipulation to the style of the output content. */
	levels?: Record<
		string,
		{
			level?: string;
			manipulator?: ((prefix: string, output: string) => string);
		}
	>;
	/** The target to output. */
	output?: 'console' | 'stdout';
}
