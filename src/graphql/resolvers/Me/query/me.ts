import { ProcessingError } from '../../../../lib/errors/ProcessingError'
import { ValidationError } from '../../../../lib/errors/ValidationError'
import { batch } from '../../../../lib/graphql'
import { AuthenticatedContext } from '../../../../lib/graphql'
import { findAllMapped } from '../../../../lib/sequelize'
import { findOneMapped } from '../../../../lib/sequelize'
import { Sequelize } from '../../../../lib/sequelize'

/**
 * @query me
 * @since 1.0.0
 */
export async function me(_: any, args: any, context: AuthenticatedContext) {
	return {
		id: context.session.client.id,
		email: context.session.client.email,
		sessionToken: context.session.token,
		sessionStartedAt: context.session.startedAt,
		sessionExpiresAt: context.session.expiresAt
	}
}