import path from 'path'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader } from 'merge-graphql-schemas'
import { mergeResolvers } from 'merge-graphql-schemas'
import { mergeTypes } from 'merge-graphql-schemas'
import { RestrictedDirective } from 'endpoint/main/directives/restricted'

const schema = makeExecutableSchema({

	typeDefs: mergeTypes(
		fileLoader(path.join(__dirname, '.'), {
			extensions: ['.graphql'],
			recursive: true
		})
	),

	resolvers: mergeResolvers(
		fileLoader(path.join(__dirname, './resolvers'), {
			extensions: ['.ts'],
			recursive: false
		})
	),

	schemaDirectives: {
		restricted: RestrictedDirective
	}

})

export default schema