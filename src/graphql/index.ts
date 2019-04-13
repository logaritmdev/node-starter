import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { ProcessingError } from '../lib/errors/ProcessingError'
import { ValidationError } from '../lib/errors/ValidationError'
import { Logger } from '../lib/logger'
import { ErrorExtension } from './extensions/error'
import schema from './schema'

/**
 * The graphql server.
 * @const server
 * @since 1.0.0
 */
export const server = new ApolloServer({

	schema,

	extensions: [() => new ErrorExtension()],

	context: ({ req, res }) => ({

		req,
		res,

		t: req.gettext
	}),

	formatError: (error: GraphQLError) => {

		let format: any = {
			message: error.message,
			locations: error.locations,
			path: error.path,
		}

		let original = error.originalError
		if (original) {

			format.type = original.constructor.name

			if (original instanceof ValidationError) {
				format.keys = original.errors
			}
		}

		return format
	},

	playground: true
});
