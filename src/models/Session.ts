import { belongsTo } from '../lib/sequelize'
import { column } from '../lib/sequelize'
import { createdAt } from '../lib/sequelize'
import { defaultScope } from '../lib/sequelize'
import { foreignKey } from '../lib/sequelize'
import { nullable } from '../lib/sequelize'
import { table } from '../lib/sequelize'
import { updatedAt } from '../lib/sequelize'
import { Model } from '../lib/sequelize'
import { Op } from '../lib/sequelize'
import { Type } from '../lib/sequelize'
import { Token } from '../lib/token'
import { User } from './User'

@defaultScope(() => ({

	where: {
		active: true
	}

}))

@table({
	charset: 'utf8',
	collate: 'utf8_unicode_ci',
	tableName: 'session',
})

export class Session extends Model<Session> {

	//--------------------------------------------------------------------------
	// Columns
	//--------------------------------------------------------------------------

	/**
	 * @column token
	 * @since 1.0.0
	 */
	@column(Type.STRING) token: string

	/**
	 * @column active
	 * @since 1.0.0
	 */
	@column(Type.BOOLEAN, { defaultValue: true }) active: boolean

	/**
	 * @column revoked
	 * @since 1.0.0
	 */
	@column(Type.BOOLEAN, { defaultValue: false }) revoked: boolean

	/**
	 * @column clientId
	 * @since 1.0.0
	 */
	@column(Type.DATE) startedAt: Date

	/**
	 * @column clientId
	 * @since 1.0.0
	 */
	@column(Type.DATE) expiresAt: Date

	/**
	 * @column revokedAt
	 * @since 1.0.0
	 */
	@nullable @column(Type.DATE) revokedAt: Date

	/**
	 * @column createdAt
	 * @since 1.0.0
	 */
	@createdAt createdAt: Date

	/**
	 * @column updatedAt
	 * @since 1.0.0
	 */
	@updatedAt updatedAt: Date

	//--------------------------------------------------------------------------
	// Relations
	//--------------------------------------------------------------------------

	/**
	 * @column userId
	 * @since 1.0.0
	 */
	@foreignKey(
		() => User
	) userId: ID

	/**
	 * @relation user
	 * @since 1.0.0
	 */
	@belongsTo(
		() => User, { foreignKey: 'userId' }
	) user: User

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Creates a new session or returns an existing valid one.
	 * @method open
	 * @since 1.0.0
	 */
	static async start(user: User, startedAt?: Date, expiresAt?: Date) {

		let now = new Date()

		let session = await Session.findOne({
			where: {
				userId: user.id,
				startedAt: { [Op.gt]: now },
				expiresAt: { [Op.gt]: now },
				active: true
			}
		})

		if (session == null) {

			if (startedAt == null) {
				startedAt = new Date()
			}

			if (expiresAt == null) {
				expiresAt = new Date()
				expiresAt.setMonth(
					expiresAt.getMonth() + 1
				)
			}

			let token = await Token.sign({ exp: expiresAt.getTime() })

			session = await Session.create({
				token: token,
				issuedAt: startedAt,
				startedAt: startedAt,
				expiresAt: expiresAt,
				userId: user.id
			})

		} else {
			// TODO update the session expiration
		}

		return session
	}

	/**
	 * Stops the session.
	 * @method stop
	 * @since 1.0.0
	 */
	public async stop() {
		await this.update({ active: false })
	}
}
