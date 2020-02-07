import path from 'path'
import { resolverLoader } from '../../../lib/graphql'
import { User } from '../../../models/User'

export default {

	User: {

		id(record: User) {
			return record.id
		},

		role(record: User) {
			return record.role
		},

		firstname(record: User) {
			return record.firstname
		},

		lastname(record: User) {
			return record.lastname
		},

		image(record: User) {
			return record.image
		},

		phone(record: User) {
			return record.phone
		},

		email(record: User) {
			return record.email
		},

		createdAt(record: User) {
			return record.createdAt
		},

		updatedAt(record: User) {
			return record.updatedAt
		}
	},

	Query: {
		...resolverLoader(path.join(__dirname, 'User/query'))
	},

	Mutation: {
		...resolverLoader(path.join(__dirname, 'User/mutation'))
	}
}