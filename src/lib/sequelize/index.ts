import { merge } from 'lodash'
import { BelongsToOptions } from 'sequelize'
import { FindOptions } from 'sequelize'
import { HasManyOptions } from 'sequelize'
import { HasOneOptions } from 'sequelize'
import { ModelAttributeColumnOptions } from 'sequelize'
import { AllowNull } from 'sequelize-typescript'
import { BelongsTo } from 'sequelize-typescript'
import { BelongsToMany } from 'sequelize-typescript'
import { BelongsToManyOptions } from 'sequelize-typescript'
import { Column } from 'sequelize-typescript'
import { DataType } from 'sequelize-typescript'
import { ForeignKey } from 'sequelize-typescript'
import { HasMany } from 'sequelize-typescript'
import { HasOne } from 'sequelize-typescript'
import { Model as BaseModel } from 'sequelize-typescript'
import { ModelClassGetter } from 'sequelize-typescript'
import { PrimaryKey } from 'sequelize-typescript'
import { ThroughOptions } from 'sequelize-typescript'
import { findIn } from './private'
import { groupAllBy } from './private'
import { groupOneBy } from './private'
import { setFindAfter } from './private'
import { setFindLimit } from './private'
import { setFindOrder } from './private'
import { setFindQuery } from './private'

/**
 * The base sequelize model.
 * @class Model
 * @since 1.0.0
 */
export class Model<T = any> extends BaseModel<T> {

	/**
	 * Find records using common querying values
	 * @function findAllByPrimaryKeys
	 * @since 1.0.0
	 */
	public static findAllBy<T extends Model<T>>(

		this: { new(): T } & typeof Model,
		opts: FindOptions,
		order?: string | null,
		limit?: number | null,
		after?: number | null,
		query?: string | null,
		field?: string | Array<string> | null

	) {

		let options: FindOptions = {}

		merge(options, opts)

		if (typeof order == 'string') setFindOrder(options, order)
		if (typeof limit == 'number') setFindLimit(options, limit)
		if (typeof after == 'number') setFindAfter(options, after)

		if (query && field) {
			setFindQuery(options, query, field)
		}

		return this.findAll(options)
	}

	/**
	 * Convenience loader function to load using a primary key.
	 * @function loadAllByPrimaryKeys
	 * @since 1.0.0
	 */
	public static loadAllByPrimaryKeys<T extends Model<T>>(this: { new(): T } & typeof Model, ids: ReadonlyArray<ID>, key: string = 'id', opts: Partial<FindOptions> = {}): Promise<Array<T>> {
		return findIn(this, key, ids, opts).then(rows => groupOneBy(rows, key, ids))
	}

	/**
	 * Convenience loader function to load using a foreign key.
	 * @function loadAllByForeignKeys
	 * @since 1.0.0
	 */
	public static loadAllByForeignKeys<T extends Model<T>>(this: { new(): T } & typeof Model, ids: ReadonlyArray<ID>, key: string = 'id', opts: Partial<FindOptions> = {}): Promise<Array<Array<T>>> {
		return findIn(this, key, ids, opts).then(rows => groupAllBy(rows, key, ids))
	}
}

/**
 * Sequelize column decorator
 * @function column
 * @since 1.0.0
 */
export function column(type: any, options: Partial<ModelAttributeColumnOptions> = {}): Function {

	let initial: Partial<ModelAttributeColumnOptions> = {
		allowNull: false
	}

	return function (target: any, property: string): void {
		Column({
			...initial,
			...options,
			type
		})(target, property)
	}
}

/**
 * Sequelize foreignKey decorator.
 * @function foreignKey
 * @since 1.0.0
 */
export function foreignKey(model: ModelClassGetter, options: Partial<ModelAttributeColumnOptions> = {}) {

	let initial: Partial<ModelAttributeColumnOptions> = {
		allowNull: false
	}

	return function (target: any, property: string): void {

		Column({
			...initial,
			...options,
			type: DataType.INTEGER
		})(target, property)

		ForeignKey(model)(target, property)
	}
}

/**
 * Sequelize primaryKey decorator.
 * @function primaryKey
 * @since 1.0.0
 */
export function primaryKey(target: any, property: string) {
	PrimaryKey(target, property)
}


/**
 * Sequelize nullable decorator
 * @function nullable
 * @since 1.0.0
 */
export function nullable(target: any, property: string): void {
	AllowNull(true)(target, property)
}

/**
 * Sequelize belongsTo decorator.
 * @function belongsTo
 * @since 1.0.0
 */
export function belongsTo(model: ModelClassGetter, options: BelongsToOptions = {}) {

	let initial: Partial<BelongsToOptions> = {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	}

	return function (target: any, property: string): void {
		BelongsTo(model, {
			...initial,
			...options
		})(target, property)
	}
}

/**
 * Sequelize belongsToMany decorator.
 * @function belongsToMany
 * @since 1.0.0
 */
export function belongsToMany(model: ModelClassGetter, through: ModelClassGetter | string | ThroughOptions, options: Partial<BelongsToManyOptions> = {}) {

	let initial: Partial<BelongsToManyOptions> = {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	}

	return function (target: any, property: string): void {
		BelongsToMany(model, {
			...initial,
			...options,
			through
		})(target, property)
	}
}

/**
 * Sequelize hasOne decorator.
 * @function hasOne
 * @since 1.0.0
 */
export function hasOne(model: ModelClassGetter, options: Partial<HasOneOptions> = {}) {

	let initial: Partial<HasOneOptions> = {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	}

	return function (target: any, property: string): void {
		HasOne(model, {
			...initial,
			...options
		})(target, property)
	}
}

/**
 * Sequelize hasMany decorator.
 * @function hasMany
 * @since 1.0.0
 */
export function hasMany(model: ModelClassGetter, options: Partial<HasManyOptions> = {}) {

	let initial: Partial<HasManyOptions> = {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	}

	return function (target: any, property: string): void {
		HasMany(model, {
			...initial,
			...options
		})(target, property)
	}
}

/**
 * @type Type
 * @since 1.0.0
 */
export { DataType as Type } from 'sequelize-typescript'

/**
 * @function table
 * @since 1.0.0
 */
export { Table as table } from 'sequelize-typescript'

/**
 * @function unique
 * @since 1.0.0
 */
export { Unique as unique } from 'sequelize-typescript'

/**
 * @function createdAt
 * @since 1.0.0
 */
export { CreatedAt as createdAt } from 'sequelize-typescript'

/**
 * @function updatedAt
 * @since 1.0.0
 */
export { UpdatedAt as updatedAt } from 'sequelize-typescript'

/**
 * @function deletedAt
 * @since 1.0.0
 */
export { DeletedAt as deletedAt } from 'sequelize-typescript'

/**
 * @function onBeforeValidate
 * @since 1.0.0
 */
export { BeforeValidate as onBeforeValidate } from 'sequelize-typescript'

/**
 * @function onBeforeCreate
 * @since 1.0.0
 */
export { BeforeCreate as onBeforeCreate } from 'sequelize-typescript'

/**
 * @function onBeforeUpdate
 * @since 1.0.0
 */
export { BeforeUpdate as onBeforeUpdate } from 'sequelize-typescript'

/**
 * @function onBeforeDestroy
 * @since 1.0.0
 */
export { BeforeDestroy as onBeforeDestroy } from 'sequelize-typescript'

/**
 * @function defaultScope
 * @since 1.0.0
 */
export { DefaultScope as defaultScope } from 'sequelize-typescript'

/**
 * @function scope
 * @since 1.0.0
 */
export { Scopes as scopes } from 'sequelize-typescript'

/**
 * @enum Op
 * @since 1.0.0
 */
export { Op } from 'sequelize'