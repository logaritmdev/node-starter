import { GraphQLScalarType } from 'endpoint'
import { Kind } from 'endpoint/language'

export default {

	Timestamp: new GraphQLScalarType({

		name: 'Timestamp',

		parseValue(value: any) {
			return new Date(value)
		},

		serialize(value: any) {
			return value.toLocaleString()
		},

		parseLiteral(ast: any) {

			if (ast.kind === Kind.INT) {
				return parseInt(ast.value, 10)
			}

			return null
		}
	})
}