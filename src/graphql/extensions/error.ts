import { GraphQLExtension } from 'graphql-extensions'
import { GraphQLResponse } from 'graphql-extensions'
import { Context } from '../../lib/graphql'
import { Logger } from '../../lib/logger'

type GraphQLResponseData = {
	graphqlResponse: GraphQLResponse;
	context: Context;
}

/**
 * Properly logs errors.
 * @class ErrorExtension
 * @since 1.0.0
 */
export class ErrorExtension extends GraphQLExtension {

	/**
	 * @inherited
	 * @method willSendResponse
	 * @since 1.0.0
	 */
	willSendResponse(response: GraphQLResponseData) {
		let {
			context,
			graphqlResponse
		} = response

		if (graphqlResponse.errors) {
			graphqlResponse.errors.forEach(error => {
				Logger.e('GRAPHQL', '', context.req, error)
			})
		}

		return response
	}
}