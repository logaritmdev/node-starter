import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLField } from 'graphql'
import { AuthorizationError } from '../../lib/errors/AuthorizationError'
import { AuthorizationTokenError } from '../../lib/errors/AuthorizationTokenError'
import { AuthenticatedContext } from '../../lib/graphql'
import { Sequelize } from '../../lib/sequelize'
import { Token } from '../../lib/token'
import { Client } from '../../models/Client'
import { Session } from '../../models/Session'

/**
 * Restricts the action to authenticated user.
 * @directive restricted
 * @since 1.0.0
 */
export class RestrictedDirective extends SchemaDirectiveVisitor {

	/**
	 * Make sure the resolve is executed from an authenticated user.
	 * @method visitFieldDefinition
	 * @since 1.0.0
	 */
	public visitFieldDefinition(field: GraphQLField<any, AuthenticatedContext>) {

		let { resolve } = field

		field.resolve = async function (root, args, context, info) {

			let valid = false
			let token = context.req.authorization.credentials
			if (token == null) {
				throw new AuthorizationTokenError('The authorization token is missing.')
			}

			valid = await Token.verify(token)

			if (valid == false) {
				throw new AuthorizationTokenError('The authorization token is invalid.')
			}

			let now = new Date()

			let session = await Session.find({

				where: {
					token,
					startedAt: { [Sequelize.Op.lte]: now },
					expiresAt: { [Sequelize.Op.gte]: now },
					active: true
				},

				include: [
					Client
				]
			})

			if (session == null) {
				throw new AuthorizationError('You are not authorized to perform this action.')
			}

			/*
			 * We have a valid authenticated session, it will be used
			 * for the remaining of the request.
			 */

			context.session = session

			return resolve!.call(this, root, args, context, info)
		}
	}
}
