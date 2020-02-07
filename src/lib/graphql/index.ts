import DataLoader from 'dataloader'
import fs from 'fs'
import path from 'path'
import { Request } from 'express'
import { Response } from 'express'
import { Dictionary } from 'lodash'
import { Session } from 'models/Session'
import { User } from 'models/User'

/**
 * The GraphQL resolver context.
 * @interface Context
 * @since 1.0.0
 */
export interface Context {

	req: Request
	res: Response

	t: (msg: string) => string

	loader: {
		user: DataLoader<ID, User>,
	}
}

/**
 * The GraphQL resolver context for client restricted actions.
 * @interface AuthenticatedContext
 * @since 1.0.0
 */
export interface AuthenticatedContext extends Context {
	session: Session
}

/**
 * Returns an object of resolvers from the file system.
 * @function resolverLoader
 * @since 1.0.0
 */
export function resolverLoader(dir: string) {

	let resolvers: Dictionary<Function> = {}

	fs.readdirSync(dir).forEach(name => {

		let file = path.join(dir, name)

		if (path.extname(file) != '.ts' &&
			path.extname(file) != '.js') {
			return
		}

		let func = name
		func = func.replace(/\.ts$/, '')
		func = func.replace(/\.js$/, '')

		let exported = require(file)

		let resolver = exported[func]
		if (resolver == null) {
			throw new Error(`File at ${file} does not export a resolver named ${func}.`)
		}

		resolvers[func] = resolver
	})

	return resolvers
}
