import { ProcessingError } from '../../../../lib/errors/ProcessingError'
import { ValidationError } from '../../../../lib/errors/ValidationError'
import { Crypto } from '../../../../lib/crypto'
import { Context } from '../../../../lib/graphql'
import { Client } from '../../../../models/Client'
import { Session } from '../../../../models/Session'
import { AuthenticateMeInput } from '../../../types'

/**
 * @mutation authenticateMe
 * @since 1.0.0
 */
export async function authenticateMe(_: any, { input }: { input: AuthenticateMeInput }, context: Context) {

	let {
		email,
		passw
	} = input

	email = email.trim()
	passw = passw.trim()

	if (email === '' ||
		passw === '') {
		throw new ValidationError(context.t('The email address and / or password cannot be empty.'))
	}

	let client = await Client.find({
		where: {
			email
		}
	})

	if (client == null) {
		throw new ValidationError(context.t('The email address does not exists.'))
	}

	let valid = await Crypto.compare(passw, client.passw)
	if (valid == false) {
		throw new ValidationError(context.t('The email address and password don’t match.'))
	}

	if (client.active === false) {
		throw new ProcessingError(context.t('This account has been deactivated.'))
	}

	let startedAt = new Date()
	let expiresAt = new Date()

	expiresAt.setMonth(
		expiresAt.getMonth() + 1
	)

	let session = await Session.start(
		client,
		startedAt,
		expiresAt
	)

	return {
		id: client.id,
		email: client.email,
		sessionToken: session.token,
		sessionStartedAt: session.startedAt,
		sessionExpiresAt: session.expiresAt
	}
}
