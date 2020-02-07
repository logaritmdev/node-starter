import { Context } from 'lib/graphql'
import { Database } from 'lib/database'
import { Transaction } from 'sequelize/types'
import { AuthenticateUserInput } from 'endpoint/main/types'
import { AuthenticateUserValidator } from 'endpoint/main/resolvers/User/validator/AuthenticateUserValidator'

/**
 * @function authenticateUser
 * @since 1.0.0
 */
export async function authenticateUser(_: any, { input }: { input: AuthenticateUserInput }, context: Context) {

	let error = await new AuthenticateUserValidator(context).validate(input)
	if (error) {
		throw error
	}

	return Database.transaction(async (t: Transaction) => {
		return execute(input, t)
	})
}

/**
 * @function execute
 * @since 1.0.0
 * @hidden
 */
function execute(input: AuthenticateUserInput, transaction: Transaction) {
	// TODO
}