import { AuthenticatedContext } from 'lib/graphql'
import { User } from 'models/User'
import { UserInput } from 'endpoint/main/types'

/**
 * @function user
 * @since 1.0.0
 */
export async function user(_: any, { input }: { input: UserInput }, context: AuthenticatedContext) {
	return User.findByPk(input.userId)
}