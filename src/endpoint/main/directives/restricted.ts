import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLField } from 'endpoint'
import { AuthenticatedContext } from 'lib/graphql'

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

		let {
			resolve
		} = field

		field.resolve = async function (root, args, context, info) {

			/*
			 * TODO
			 * Validates the session or throw an authentication error
			 */

			return resolve!.call(this, root, args, context, info)
		}
	}
}
