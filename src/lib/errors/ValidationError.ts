import { GraphQLError } from 'graphql'

/**
 * Thrown when a validation error occurs.
 * @class ValidationError
 * @since 1.0.0
 */
export class ValidationError extends GraphQLError {

	/**
	 * The field that failed to validate.
	 * @property field
	 * @since 1.0.0
	 */
	public readonly field?: string

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(message: string, field?: string) {
		super(message)
		this.field = field
	}
}