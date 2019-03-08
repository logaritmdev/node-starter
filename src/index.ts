/// <reference path="global.d.ts" />

import config from 'config'
import server from './server'

server.listen(config.get('server.port'), () => {
	console.log('GraphQL endpoint started on port ' + config.get('server.port') + ' for environment ' + process.env.NODE_ENV)
})