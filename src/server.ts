import config from 'config'
import express from 'express'
import path from 'path'
import { Database } from 'lib/database'
import { Logger } from 'lib/logger'
import { server as endpoint } from 'endpoint/main/server'

//------------------------------------------------------------------------------
// Errors
//------------------------------------------------------------------------------

process.on('uncaughtException', function (err: Error) {
	Logger.e('PROCESS', 'Uncaught exception.', undefined, err)
})

process.on('unhandledRejection', function (err: Error) {
	Logger.e('PROCESS', 'Unhandled rejection.', undefined, err)
})

process.on('SIGINT', function () {
	process.exit()
})

//------------------------------------------------------------------------------
// Database
//------------------------------------------------------------------------------

/**
 * The database connection.
 * @const database
 * @sine 1.0.0
 */
export const database = new Database(
	path.join(__dirname, 'models'),
	config.get<string>('database.host'),
	config.get<string>('database.name'),
	config.get<string>('database.user'),
	config.get<string>('database.pass')
).connect()

//------------------------------------------------------------------------------
// Express
//------------------------------------------------------------------------------

let app = express()
app.use(require('./express/guid').default)
app.use(require('./express/cors').default)
app.use(require('./express/body').default)
app.use(require('./express/auth').default)
app.use(require('./express/locale').default)
app.use(require('./express/logger').default)

endpoint.applyMiddleware({ app, cors: false })

export default app