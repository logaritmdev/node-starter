import { keyBy } from 'lodash'
import { Dictionary } from 'lodash'
import { AllowNull as SequelizeAllowNull } from 'sequelize-typescript'
import { Column as SequelizeColumn } from 'sequelize-typescript'
import { DataType } from 'sequelize-typescript'
import { IFindOptions } from 'sequelize-typescript/lib/interfaces/IFindOptions'
import { Model } from 'sequelize-typescript'

/**
 * @type NonAbstract<T>
 * @since 1.0.0
 */
type NonAbstract<T> = {
    [P in keyof T]: T[P]
}

/**
 * @type Constructor<T>
 * @since 1.0.0
 */
type Constructor<T> = (new () => T)

/**
 * @type NonAbstractTypeOfModel<T
 * @since 1.0.0
 */
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>

/**
 * @type FindAllMappedOptions
 * @since 1.0.0
 */
interface FindAllMappedOptions<T> {
    include?: any
}

/**
 * @type FindAllMappedOptions
 * @since 1.0.0
 */
interface FindOneMappedOptions<T> {
    include?: any
}

//------------------------------------------------------------------------------
// Decorators
//------------------------------------------------------------------------------

/**
 * Convenience function to create a non-nullable column of specified type.
 * @function Column
 * @since 1.0.0
 */
export function Column(type: any, defaultValue?: any): Function {
    return function (target: any, propertyName: string): void {
        SequelizeColumn({ type: type, defaultValue: defaultValue, allowNull: false })(target, propertyName)
    }
}

/**
 * Convenience function to create a nullable column.
 * @function Nullable
 * @since 1.0.0
 */
export function Nullable(target: any, propertyName: string): void {
    SequelizeAllowNull(true)(target, propertyName)
}

/**
 * Convenience function to create a trashedAt column.
 * @function TrashedAt
 * @since 1.0.0
 */
export function TrashedAt(target: any, propertyName: string): void {
    SequelizeColumn({ type: DataType.DATE, defaultValue: null, allowNull: true })(target, propertyName)
}

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * Convenience function to find records with order and limit.
 * @method findSome
 * @since 1.0.0
 */
export function findSome<T extends Model<T>, R>(M: NonAbstractTypeOfModel<T>, options: IFindOptions<T>, order?: string | null, limit?: string | null) {

    if (order) {

        let orders = order.replace(/\s+/, '').split(':')

        if (orders[1] == null) {
            orders[1] = 'ASC'
        }

        if (options) {
            options.order = [orders]
        }
    }

    if (limit) {

        let limits = limit.replace(/\s+/, '').split(',')

        if (limits[1] == null) {
            limits[1] = '0'
        }

        if (options) {
            options.limit = Number(limits[0])
            options.offset = Number(limits[1])
        }
    }

    return M.all(options)
}

/**
 * Convenience method to find rows mapped to a multiple values.
 * @function findAllMapped
 * @since 1.0.0
 */
export function findAllMapped<T extends Model<T>, R>(M: NonAbstractTypeOfModel<T>, records: ReadonlyArray<R>, primaryKey: string, foreignKey: string, opts: FindAllMappedOptions<T> = {}): Promise<Array<Array<T>>> {

    let ids = records.map((record: any) => record[primaryKey] as string)

    let options: any = {

        where: {
            [foreignKey]: ids
        },

        include: opts.include,
    }

    return new Promise<Array<Array<T>>>(success => M.all(options).then(data => group(ids, data, primaryKey, foreignKey)).then(success))
}

/**
 * Convenience method to find rows mapped to a single values.
 * @function findOneMapped
 * @since 1.0.0
 */
export function findOneMapped<T extends Model<T>, R>(M: NonAbstractTypeOfModel<T>, records: ReadonlyArray<R>, primaryKey: string, foreignKey: string, opts: FindOneMappedOptions<T> = {}): Promise<Array<T>> {

    let ids = records.map((record: any) => record[foreignKey] as string)

    let options: any = {

        where: {
            [primaryKey]: ids
        },

        include: opts.include,
    }

    return new Promise<Array<T>>((success, failure) => M.all(options).then(data => map(ids, data, primaryKey)).then(res => { success(res) }))
}

//------------------------------------------------------------------------------
// Private API
//------------------------------------------------------------------------------

/**
 * Map records to their specified keys.
 * @function map
 * @since 1.0.0
 */
function map<T extends any>(keys: ReadonlyArray<string | number>, records: ReadonlyArray<T>, primaryKey: string = "id") {

    let map = keyBy(
        records,
        primaryKey
    )

    return keys.map(key => map[key])
}

/**
 * Groups the batched result and map them property
 * @function batch
 * @since 1.0.0
 */
function group<T extends any>(keys: Array<string>, records: Array<T>, primaryKey: string, foreignKey: string) {

    let result: Dictionary<Array<T>> = {}

    for (let record of records) {

        let key = record[foreignKey]
        let arr = result[key]

        if (arr == null) {
            arr = result[key] = []
        }

        arr.push(record)
    }

    return keys.map(key => result[key] || [])
}

//------------------------------------------------------------------------------
// Default Exports
//------------------------------------------------------------------------------

export { Model } from 'sequelize-typescript'
export { DataType as Type } from 'sequelize-typescript'
export { BeforeCreate } from 'sequelize-typescript'
export { BeforeUpdate } from 'sequelize-typescript'
export { Table } from 'sequelize-typescript'
export { Unique } from 'sequelize-typescript'
export { AllowNull } from 'sequelize-typescript'
export { BelongsTo } from 'sequelize-typescript'
export { HasMany } from 'sequelize-typescript'
export { ForeignKey } from 'sequelize-typescript'
export { CreatedAt } from 'sequelize-typescript'
export { UpdatedAt } from 'sequelize-typescript'
export { DeletedAt } from 'sequelize-typescript'
export { Sequelize } from 'sequelize-typescript'
export { DefaultScope } from 'sequelize-typescript'
export { Scopes } from 'sequelize-typescript'
export { IFindOptions }
