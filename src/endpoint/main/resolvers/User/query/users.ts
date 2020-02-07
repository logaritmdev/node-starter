import { AuthenticatedContext } from 'lib/graphql'
import { User } from 'models/User'
import { UsersInput } from 'endpoint/main/types'

/**
 * @function users
 * @since 1.0.0
 */
export async function users(_: any, { input }: { input: UsersInput }, context: AuthenticatedContext) {

	let {
		order,
		limit,
		after,
		query
	} = input

	return User.findAllBy({}, order, limit, after, query, ['firstname', 'lastname', 'email', 'phone'])
}