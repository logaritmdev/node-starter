import cls from 'cls-hooked'
import { QueryOptionsWithType } from 'sequelize'
import { QueryTypes } from 'sequelize'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { SequelizeOptions } from 'sequelize-typescript'

/**
 * The cls namespace.
 * @const namespace
 * @since 1.0.0
 */
export const sequelize = cls.createNamespace('sequelize')

/**
 * A wrapper around the sequelize database.
 * @class Database
 * @since 1.0.0
 */
export class Database {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * All database instances.
	 * @property instances
	 * @since 1.0.0
	 */
	public static instances: Array<Database> = []

	/**
	 * Performs a transaction.
	 * @method transaction
	 * @since 1.0.0
	 */
	public static transaction<T>(callback: ((T: Transaction) => Promise<T>)) {

		let database = this.instances[this.instances.length - 1]
		if (database == null) {
			throw new Error('No database connection to perform transaction.')
		}

		return database.transaction(callback)
	}

	/**
	 * Performs a query.
	 * @method transaction
	 * @since 1.0.0
	 */
	public static query<T extends object>(sql: string | { query: string; values: unknown[] }, options: QueryOptionsWithType<QueryTypes.SELECT>): Promise<T[]> {

		let database = this.instances[this.instances.length - 1]
		if (database == null) {
			throw new Error('No database connection to perform transaction.')
		}

		return database.query(sql, options)
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The sequelize connection.
	 * @property
	 * @since 1.0.0
	 */
	public connection?: Sequelize | null

	/**
	 * The database host.
	 * @property host
	 * @since 1.0.0
	 */
	public readonly host: string

	/**
	 * The database name.
	 * @property database
	 * @since 1.0.0
	 */
	public readonly database: string

	/**
	 * The database username.
	 * @property username
	 * @since 1.0.0
	 */
	public readonly username: string

	/**
	 * The database password.
	 * @property password
	 * @since 1.0.0
	 */
	public readonly password: string

	/**
	 * The models path.
	 * @property path
	 * @since 1.0.0
	 */
	public readonly path: string

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(path: string, host: string, database: string, username: string, password: string) {

		this.path = path
		this.host = host
		this.database = database
		this.username = username
		this.password = password

		Database.instances.push(this)
	}

	/**
	 * Connects to the database.
	 * @method connect
	 * @since 1.0.0
	 */
	public connect() {

		if (this.connection) {
			throw new Error(`
				Database Error:
				Unable to connect, connection is already opened.
			`)
		}

		let options: SequelizeOptions = {
			host: this.host,
			database: this.database,
			username: this.username,
			password: this.password,
			modelPaths: [this.path],
			logging: false,
			dialect: 'mysql',
			dialectOptions: {
				charset: 'utf8'
			}
		}

		this.connection = new Sequelize(options)
		this.connection.sync()

		process.on('exit', () => {

			if (this.connection) {
				this.connection.close()
				this.connection = null
			}

			let index = Database.instances.indexOf(this)
			if (index > -1) {
				Database.instances.splice(index, 1)
			}
		})

		return this
	}

	/**
	 * Connects to the database.
	 * @method disconnect
	 * @since 1.0.0
	 */
	public disconnect() {

		if (this.connection) {
			this.connection.close()
		}

		let index = Database.instances.indexOf(this)
		if (index > -1) {
			Database.instances.splice(index, 1)
		}

		return this
	}

	/**
	 * Performs a transaction.
	 * @method transaction
	 * @since 1.0.0
	 */
	public async transaction<T>(callback: ((t: Transaction) => Promise<T>)) {

		let connection = this.connection
		if (connection == null) {
			throw new Error('Unable to begin transaction on disconnected database')
		}

		return connection.transaction(callback)
	}

	/**
	 * Performs a query.
	 * @method transaction
	 * @since 1.0.0
	 */
	public query<T extends object>(sql: string | { query: string; values: unknown[] }, options: QueryOptionsWithType<QueryTypes.SELECT>): Promise<T[]> {

		let connection = this.connection
		if (connection == null) {
			throw new Error('Unable to begin transaction on disconnected database')
		}

		return connection.query(sql, options)
	}
}

/**
 * Sets the cls namespace. This does not work for me but its still
 * there just in case.
 */
Sequelize.useCLS(sequelize)