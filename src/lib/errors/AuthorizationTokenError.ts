import { ApolloError } from 'apollo-server-express'

/**
 * Thrown when the authorization token is invalid.
 * @class AuthorizationTokenError
 * @since 1.0.0
 */
export class AuthorizationTokenError extends ApolloError {

	/**
	 * The error name.
	 * @property name
	 * @since 1.0.0
	 */
	readonly name: string = 'AuthorizationTokenError'

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(message: string) {
		super(message, 'AUTHORIZATION_TOKEN_ERROR')
	}
}
