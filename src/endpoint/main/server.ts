import schema from './schema'
import { ApolloServer } from 'apollo-server-express'
import { User } from 'models/User'
import { ErrorExtension } from 'endpoint/extensions/Error'

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

		t: req.gettext,

		loader: {
			user: User.loadOne()
		}
	}),

	playground: true
});
