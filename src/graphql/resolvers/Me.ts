import { ProcessingError } from '../../lib/errors/ProcessingError'
import { ValidationError } from '../../lib/errors/ValidationError'
import { batch } from '../../lib/graphql'
import { Context } from '../../lib/graphql'
import { findAllMapped } from '../../lib/sequelize'
import { findOneMapped } from '../../lib/sequelize'
import { authenticateMe } from './Me/mutation/authenticateMe'
import { invalidateMe } from './Me/mutation/invalidateMe'
import { me } from './Me/query/me'

/**
 * @interface AuthenticatedClient
 * @since 1.0.0
 */
interface AuthenticatedClient {
	id: string
	email: string
	verified: boolean
	sessionToken?: string
	sessionStartedAt?: Date
	sessionExpiresAt?: Date
}

export default {

	Me: {

		id(record: AuthenticatedClient) {
			return record.id
		},

		email(record: AuthenticatedClient) {
			return record.email
		},

		sessionToken(record: AuthenticatedClient, args: any, context: Context) {
			return record.sessionToken
		},

		sessionStartedAt(record: AuthenticatedClient, args: any, context: Context) {
			return record.sessionStartedAt
		},

		sessionExpiresAt(record: AuthenticatedClient, args: any, context: Context) {
			return record.sessionExpiresAt
		}
	},

	Query: {
		me,
	},

	Mutation: {
		authenticateMe,
		invalidateMe
	}
}
