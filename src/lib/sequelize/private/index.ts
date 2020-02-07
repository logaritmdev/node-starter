import { merge } from 'lodash'
import { Dictionary } from 'lodash'
import { FindOptions } from 'sequelize'
import { Op } from 'sequelize'
import { WhereOptions } from 'sequelize'
import { Model } from 'sequelize-typescript'
export { Op } from 'sequelize'
export { Sequelize } from 'sequelize-typescript'

/**
 * @type NonAbstract<T>
 * @since 1.0.0
 */
export type NonAbstract<T> = {
	[P in keyof T]: T[P]
}

/**
 * @type Constructor<T>
 * @since 1.0.0
 */
export type Constructor<T> = (new () => T)

/**
 * @type NonAbstractTypeOfModel<T
 * @since 1.0.0
 */
export type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>

//------------------------------------------------------------------------------
// Functions
//------------------------------------------------------------------------------

/**
 * @function setFindQuery
 * @since 1.0.0
 * @hidden
 */
export function setFindQuery(options: FindOptions, query: string, field: string | Array<string>) {

	if (query) {
		query = '%' + query + '%'
	}

	let where = options.where as any
	if (where == null) {
		where = options.where = {}
	}

	if (typeof field == 'string') {

		where[field] = {
			[Op.like]: query
		}

	} else {

		let clauses: Array<WhereOptions> = []

		for (let key of field) {
			clauses.push({
				[key]: {
					[Op.like]: query
				}
			})
		}

		where[Op.or] = clauses
	}
}

/**
 * @function setFindOrder
 * @since 1.0.0
 * @hidden
 */
export function setFindOrder(options: FindOptions, order: string) {

	let orders = order.replace(/\s+/, '').split(':')

	if (orders[1] == null) {
		orders[1] = 'ASC'
	}

	options.order = [
		orders[0],
		orders[1]
	]
}

/**
 * @function setFindLimit
 * @since 1.0.0
 * @hidden
 */
export function setFindLimit(options: FindOptions, limit: number) {
	options.limit = limit
}

/**
 * @function setFindAfter
 * @since 1.0.0
 * @hidden
 */
export function setFindAfter(options: FindOptions, after: number) {
	options.offset = after
}

/**
 * @function findIn
 * @since 1.0.0
 * @hidden
 */
export function findIn<T extends Model<T>>(M: NonAbstractTypeOfModel<T>, key: string, ids: any, opts: FindOptions = {}) {

	let options = { ...opts }

	let where = options.where as any
	if (where == null) {
		where = options.where = {}
	}

	where[key] = ids

	return M.findAll(options)
}

/**
 * @function groupOneBy
 * @since 1.0.0
 * @hidden
 */
export function groupOneBy(rows: Array<any>, key: string, ids: ReadonlyArray<string>) {

	let records: Dictionary<any> = []

	for (let row of rows) {
		records[row[key]] = row
	}

	return ids.map(value => records[value])
}

/**
 * @function groupAllBy
 * @since 1.0.0
 * @hidden
 */
export function groupAllBy(rows: Array<any>, key: string, ids: ReadonlyArray<string>) {

	let records: Dictionary<any> = []

	for (let row of rows) {

		let index = row[key]

		if (records[index] == null) {
			records[index] = []
		}

		records[index].push(row)
	}

	return ids.map((value: any) => records[value] || [])
}