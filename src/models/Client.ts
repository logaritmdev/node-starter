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
import { Session } from './Session'

@Table({
	charset: 'utf8',
	collate: 'utf8_unicode_ci',
	tableName: 'client',
})

export class Client extends Model<Client> {

	//--------------------------------------------------------------------------
	// Columns
	//--------------------------------------------------------------------------

	/**
	 * @column email
	 * @since 1.0.0
	 */
	@Column(Type.STRING) email: string

	/**
	 * @column passw
	 * @since 1.0.0
	 */
	@Column(Type.STRING) passw: string

	/**
	 * @column active
	 * @since 1.0.0
	 */
	@Column(Type.BOOLEAN, true) active: boolean

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

	/**
	 * @column deletedAt
	 * @since 1.0.0
	 */
	@DeletedAt deletedAt: Date

	//--------------------------------------------------------------------------
	// Relations
	//--------------------------------------------------------------------------

	/**
	 * @many Session
	 * @since 1.0.0
	 */
	@HasMany(
		() => Session
	) sessions: Array<Session> = []

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * Convenience method to find by primary key.
	 * @method pk
	 * @since 1.0.0
	 */
	public static pk(id: ID) {
		return Client.findById(id)
	}

	/**
	 * Convenience method to fetch with graphql order and limit.
	 * @method some
	 * @since 1.0.0
	 */
	public static some(options: IFindOptions<Client>, order?: string | null, limit?: string | null) {
		return findSome(Client, options, order, limit)
	}
}
