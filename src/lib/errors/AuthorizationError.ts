import { ApolloError } from 'apollo-server-express'

/**
 * Thrown when the user is unauthorize to perform an action.
 * @class AuthorizationError
 * @since 1.0.0
 */
export class AuthorizationError extends ApolloError {
	/**
	 * The error name.
	 * @property name
	 * @since 1.0.0
	 */
	readonly name: string = 'AuthorizationError'

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(message: string) {
		super(message, 'AUTHORIZATION_ERROR')
	}
}
