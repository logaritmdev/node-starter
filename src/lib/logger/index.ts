import config from 'config'
import fs from 'fs'
import path from 'path'
import winston from 'winston'
import { Request } from 'express'

/**
 * A wrapper around a winston logger.
 * @class Logger
 * @since 1.0.0
 */
export class Logger {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * @property main
	 * @since 1.0.0
	 * @hidden
	 */
	private static main: Logger = new Logger()

	/**
	 * Logs a message of 'error' severity.
	 * @method e
	 * @since 1.0.0
	 */
	public static e(tag: string, message: string, req?: Request, err?: Error) {
		return this.main.log('error', tag, message, req, err)
	}

	/**
	 * Logs a message of 'warn' severity.
	 * @method w
	 * @since 1.0.0
	 */
	public static w(tag: string, message: string, req?: Request, err?: Error) {
		return this.main.log('warn', tag, message, req, err)
	}

	/**
	 * Logs a message of 'error' severity.
	 * @method e
	 * @since 1.0.0
	 */
	public static i(tag: string, message: string, req?: Request, err?: Error) {
		return this.main.log('info', tag, message, req, err)
	}

	/**
	 * Logs a message of 'verbose' severity.
	 * @method v
	 * @since 1.0.0
	 */
	public static v(tag: string, message: string, req?: Request, err?: Error) {
		return this.main.log('verbose', tag, message, req, err)
	}

	/**
	 * Logs a message of 'debug' severity.
	 * @method d
	 * @since 1.0.0
	 */
	public static d(tag: string, message: string, req?: Request, err?: Error) {
		return this.main.log('debug', tag, message, req, err)
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * @property winston
	 * @since 1.0.0
	 * @hidden
	 */
	private winston: any

	/**
	 * @property transports
	 * @since 1.0.0
	 * @hidden
	 */
	private transports: any = []

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor() {

		this.transports.push(new winston.transports.Console({ format: winston.format.simple() }))

		if (process.env.NODE_ENV == 'production') {

			if (fs.existsSync(config.get('log.path')) == false) {
				fs.mkdirSync(config.get('log.path'))
			}

			this.transports.push(new winston.transports.File({ filename: path.join(config.get('log.path'), 'node-app-info.log'), level: 'info' }))
			this.transports.push(new winston.transports.File({ filename: path.join(config.get('log.path'), 'node-app-error.log'), level: 'error' }))
		}

		this.winston = winston.createLogger({ level: config.get('log.level'), format: winston.format.json(), transports: this.transports })
	}

	/**
	 * Logs a message of 'error' severity.
	 * @method e
	 * @since 1.0.0
	 */
	public e(tag: string, message: string, req?: Request, err?: Error) {
		return this.log('error', tag, message, req, err)
	}

	/**
	 * Logs a message of 'warn' severity.
	 * @method w
	 * @since 1.0.0
	 */
	public w(tag: string, message: string, req?: Request, err?: Error) {
		return this.log('warn', tag, message, req, err)
	}

	/**
	 * Logs a message of 'error' severity.
	 * @method e
	 * @since 1.0.0
	 */
	public i(tag: string, message: string, req?: Request, err?: Error) {
		return this.log('info', tag, message, req, err)
	}

	/**
	 * Logs a message of 'verbose' severity.
	 * @method v
	 * @since 1.0.0
	 */
	public v(tag: string, message: string, req?: Request, err?: Error) {
		return this.log('verbose', tag, message, req, err)
	}

	/**
	 * Logs a message of 'debug' severity.
	 * @method d
	 * @since 1.0.0
	 */
	public d(tag: string, message: string, req?: Request, err?: Error) {
		return this.log('debug', tag, message, req, err)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method log
	 * @since 1.0.0
	 * @hidden
	 */
	private log(level: string, tag: string, message: string, req?: Request, err?: Error) {

		if (tag) message = '[TAG: ' + tag + '] ' + message
		if (req) message = '[REQ: ' + req.guid + '] ' + message

		if (err) {
			message = message + ' Error: ' + err.stack
		}

		this.winston.log({ level, message })

		return this
	}
}
