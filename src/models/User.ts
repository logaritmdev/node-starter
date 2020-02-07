import DataLoader from 'dataloader'
import { column } from '../lib/sequelize'
import { createdAt } from '../lib/sequelize'
import { defaultScope } from '../lib/sequelize'
import { deletedAt } from '../lib/sequelize'
import { hasMany } from '../lib/sequelize'
import { nullable } from '../lib/sequelize'
import { onBeforeCreate } from '../lib/sequelize'
import { onBeforeDestroy } from '../lib/sequelize'
import { onBeforeUpdate } from '../lib/sequelize'
import { table } from '../lib/sequelize'
import { updatedAt } from '../lib/sequelize'
import { Model } from '../lib/sequelize'
import { Type } from '../lib/sequelize'
import { Session } from './Session'

@defaultScope(() => ({

	where: {
		active: true
	}

}))

@table({
	charset: 'utf8',
	collate: 'utf8_unicode_ci',
	tableName: 'user',
})

export class User extends Model<User> {

	//--------------------------------------------------------------------------
	// Columns
	//--------------------------------------------------------------------------

	/**
	 * @column firstname
	 * @since 1.0.0
	 */
	@column(Type.STRING) firstname: string

	/**
	 * @column lastname
	 * @since 1.0.0
	 */
	@column(Type.STRING) lastname: string

	/**
	 * @column phone
	 * @since 1.0.0
	 */
	@column(Type.STRING) phone: string

	/**
	 * @column email
	 * @since 1.0.0
	 */
	@column(Type.STRING) email: string

	/**
	 * @column passw
	 * @since 1.0.0
	 */
	@nullable @column(Type.STRING) passw: string

	/**
	 * @column image
	 * @since 1.0.0
	 */
	@nullable @column(Type.STRING) image: string

	/**
	 * @column type
	 * @since 1.0.0
	 */
	@column(Type.ENUM('ADMIN', 'USER'), { defaultValue: 'USER' }) role: string

	/**
	 * @column active
	 * @since 1.0.0
	 */
	@column(Type.BOOLEAN, { defaultValue: true }) active: boolean

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

	/**
	 * @column deletedAt
	 * @since 1.0.0
	 */
	@deletedAt deletedAt: Date

	//--------------------------------------------------------------------------
	// Relations
	//--------------------------------------------------------------------------

	/**
	 * @relation sessions
	 * @since 1.0.0
	 */
	@hasMany(
		() => Session
	) sessions: Array<Session>

	//--------------------------------------------------------------------------
	// Hooks
	//--------------------------------------------------------------------------

	/**
	 * @hook onBeforeCreate
	 * @since 1.0.0
	 */
	@onBeforeCreate
	private static onBeforeCreate(record: User, options: any) {
		if (options.transaction === undefined) {
			throw new Error('Missing transaction.')
		}
	}

	/**
	 * @hook onBeforeUpdate
	 * @since 1.0.0
	 */
	@onBeforeUpdate
	private static onBeforeUpdate(record: User, options: any) {
		if (options.transaction === undefined) {
			throw new Error('Missing transaction.')
		}
	}

	/**
	 * @hook onBeforeDestroy
	 * @since 1.0.0
	 */
	@onBeforeDestroy
	private static onBeforeDestroy(record: User, options: any) {
		if (options.transaction === undefined) {
			throw new Error('Missing transaction.')
		}
	}

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * @method loadOne
	 * @since 1.0.0
	 */
	public static loadOne = () => new DataLoader((ids: ReadonlyArray<ID>) => {
		return User.loadAllByPrimaryKeys(ids)
	})
}
