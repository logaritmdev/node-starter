import { ProcessingError } from '../../../../lib/errors/ProcessingError'
import { ValidationError } from '../../../../lib/errors/ValidationError'
import { batch } from '../../../../lib/graphql'
import { AuthenticatedContext } from '../../../../lib/graphql'
import { findAllMapped } from '../../../../lib/sequelize'
import { findOneMapped } from '../../../../lib/sequelize'
import { Sequelize } from '../../../../lib/sequelize'

/**
 * @mutation invalidateMe
 * @since 1.0.0
 */
export async function invalidateMe(root: any, args: any, context: AuthenticatedContext) {
	context.session.stop()
	return true
}
