import { Request } from 'express'
import { Response } from 'express'
import { Logger } from '../lib/logger'

export default function (req: Request, res: Response, next: Function) {

	let q = req.body.query
	let v = req.body.variables

	if (q) {

		if (v) {
			v = JSON.stringify(v, null, 2)
		}

		/*
		 * Display special formating for graphql query since this is what the
		 * server will handle most of the time. Also skip introspection query
		 * because they're just annoying.
		 */

		if (q.indexOf('IntrospectionQuery') == -1) {

			let message = (

				'\n' + 'Query:     ' + '\n' + q +
				'\n' + 'Variables: ' + '\n' + v

			).split('\n').map(line => {

				if (line.indexOf('Query') == 0 ||
					line.indexOf('Variables') == 0) {
					return '  ' + line
				}

				return '    ' + line

			}).join('\n')

			Logger.i('GRAPHQL', 'GraphQL Query:' + '\n' + message + '\n', req)
		}

		next()
		return
	}

	Logger.i('EXPRESS', `${req.method} ${req.path} ${JSON.stringify(req.body || '')}`, req)
	next()
}