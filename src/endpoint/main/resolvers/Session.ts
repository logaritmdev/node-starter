import path from 'path'
import { resolverLoader } from '../../../lib/graphql'
import { Context } from '../../../lib/graphql'
import { Session } from '../../../models/Session'

export default {

	Session: {

		token(record: Session) {
			return record.token
		},

		startedAt(record: Session) {
			return record.startedAt
		},

		expiresAt(record: Session) {
			return record.expiresAt
		},

		/*
		 * Relations
		 */

		user(record: Session, args: any, context: Context) {
			return context.loader.user.load(record.userId)
		}
	},

	Query: {
		...resolverLoader(path.join(__dirname, 'Session/query'))
	},

	Mutation: {
		...resolverLoader(path.join(__dirname, 'Session/mutation'))
	}
}