import { findSome } from '../lib/sequelize'
import { BelongsTo } from '../lib/sequelize'
import { Column } from '../lib/sequelize'
import { CreatedAt } from '../lib/sequelize'
import { DefaultScope } from '../lib/sequelize'
import { DeletedAt } from '../lib/sequelize'
import { ForeignKey } from '../lib/sequelize'
import { HasMany } from '../lib/sequelize'
import { IFindOptions } from '../lib/sequelize'
import { Model } from '../lib/sequelize'
import { Nullable } from '../lib/sequelize'
import { Sequelize } from '../lib/sequelize'
import { Table } from '../lib/sequelize'
import { Type } from '../lib/sequelize'
import { UpdatedAt } from '../lib/sequelize'
import { Token } from '../lib/token'
import { Client } from './Client'

@Table({
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
	@Column(Type.STRING) token: string

	/**
	 * @column active
	 * @since 1.0.0
	 */
	@Column(Type.BOOLEAN, true) active: boolean

	/**
	 * @column revoked
	 * @since 1.0.0
	 */
	@Column(Type.BOOLEAN, false) revoked: boolean

	/**
	 * @column clientId
	 * @since 1.0.0
	 */
	@Column(Type.DATE) startedAt: Date

	/**
	 * @column clientId
	 * @since 1.0.0
	 */
	@Column(Type.DATE) expiresAt: Date

	/**
	 * @column revokedAt
	 * @since 1.0.0
	 */
	@Nullable @Column(Type.DATE) revokedAt: Date

	/**
	 * @column createdAt
	 * @since 1.0.0
	 */
	@CreatedAt createdAt: Date

	/**
	 * @column updatedAt
	 * @since 1.0.0
	 */
	@UpdatedAt updatedAt: Date

	//--------------------------------------------------------------------------
	// Relations
	//--------------------------------------------------------------------------

	/**
	 * @column clientId
	 * @since 1.0.0
	 */
	@ForeignKey(() => Client) @Column(Type.INTEGER) clientId: number

	/**
	 * @belongs Client
	 * @since 1.0.0
	 */
	@BelongsTo(
		() => Client, {
			foreignKey: { name: 'clientId', allowNull: false },
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
	) client: Client


	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Creates a new session or returns an existing valid one.
	 * @method open
	 * @since 1.0.0
	 */
	static async start(client: Client, startedAt?: Date, expiresAt?: Date) {

		let now = new Date()

		let session = await Session.find({
			where: {
				clientId: client.id,
				startedAt: { $lt: now },
				expiresAt: { $gt: now },
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
				clientId: client.id
			})
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

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * Convenience method to find by primary key.
	 * @method pk
	 * @since 1.0.0
	 */
	public static pk(id: ID) {
		return Session.findById(id)
	}

	/**
	 * Convenience method to fetch with graphql order and limit.
	 * @method some
	 * @since 1.0.0
	 */
	public static some(options: IFindOptions<Session>, order?: string | null, limit?: string | null) {
		return findSome(Session, options, order, limit)
	}
}
