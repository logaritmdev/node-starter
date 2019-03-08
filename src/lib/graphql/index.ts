import { get } from 'dot-prop'
import { set } from 'dot-prop'
import { Request } from 'express'
import { Response } from 'express'
import { createBatchResolver } from 'graphql-resolve-batch'
import { Dictionary } from 'lodash'
import { Client } from '../../models/Client'
import { Session } from '../../models/Session'

/**
 * The GraphQL resolver context.
 * @interface Context
 * @since 1.0.0
 */
export interface Context {
	req: Request
	res: Response
	cache: Dictionary<any>
	t: (msg: string) => string
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
 * Wrapper around the createBatchResolver function
 * @function batch
 * @since 1.0.0
 */
export type BatchedResolver<T, C> = (records: ReadonlyArray<T>, args: any, context: C) => Promise<any>

/**
 * Wrapper around the createBatchResolver function
 * @function batched
 * @since 1.0.0
 */
export function batch(keys: Array<string>, resolvers: any) {

	for (let path of keys) {

		var callback = get(resolvers, path)
		if (callback == null) {
			console.error('Cannot batch resolver ' + path + '. The path does not exist.')
			continue
		}

		set(resolvers, path, batched(callback))
	}

	return resolvers
}

/**
 * Wrapper around the createBatchResolver function
 * @function batched
 * @since 1.0.0
 */
function batched<T, C>(resolver: BatchedResolver<T, C>) {
	return createBatchResolver<T, any, any, C>((records, args, context) => resolver(records, args, context))
}
