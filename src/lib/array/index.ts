import { Dictionary } from 'lodash'

/**
 * @function group
 * @since 1.0.0
 */
export function group<T>(array: Array<T>, key: string): Dictionary<Array<T>> {

	let groups: Dictionary<Array<T>> = {}

	for (let item of array) {

		let value = (item as any)[key]

		if (groups[value] == null) {
			groups[value] = []
		}

		groups[value].push(item)
	}

	return groups
}