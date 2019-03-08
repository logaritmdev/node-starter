import cls from 'continuation-local-storage'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

/**
 * A wrapper around the sequelize database.
 * @class Database
 * @since 1.0.0
 */
export class Database {

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

		Sequelize.useCLS(cls.createNamespace('sequelize'))
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

		let options = {
			host: this.host,
			database: this.database,
			username: this.username,
			password: this.password,
			dialect: 'mysql',
			logging: false,
			modelPaths: [this.path],
			operatorsAliases: false,
			dialectOptions: {
				charset: 'utf8'
			}
		}

		this.connection = new Sequelize(options)
		this.connection.sync()

		process.on('SIGINT', () => {

			if (this.connection) {
				this.connection.close()
				this.connection = null
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

		return this
	}

	/**
	 * Performs a transaction.
	 * @method transaction
	 * @since 1.0.0
	 */
	public transaction(callback: ((t: Transaction) => void)) {

		if (this.connection) {
			this.connection.transaction().then(callback as any)
		}

		return this
	}
}