import { GraphQLFormattedError } from 'endpoint'
import { GraphQLExtension } from 'graphql-extensions'
import { GraphQLResponse } from 'graphql-extensions'
import { Context } from 'lib/graphql'
import { Logger } from 'lib/logger'

/**
 * @type GraphQLResponseData
 * @since 1.0.0
 */
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
			graphqlResponse.errors.forEach((error: GraphQLFormattedError) => {

				let message = error.message

				let extensions = error.extensions
				if (extensions) {

					message = message + '\n' + '  Code:'
					message = message + '\n' + '    ' + extensions.code

					message = message + '\n' + '  Stack:'
					message = message + '\n' + extensions.exception.stacktrace.slice(1).join('\n')

					delete extensions.exception
				}

				Logger.e('GRAPHQL', message, context.req)

			})
		}

		return response
	}


}