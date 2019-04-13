import { GraphQLError } from 'graphql'

/**
 * The field errors.
 * @class ValidationErrors
 * @since 1.0.0
 */
export type ValidationErrors = {
	[key: string]: string
}

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
	public readonly errors?: ValidationErrors

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(message: string, errors?: ValidationErrors) {
		super(message)
		this.errors = errors
	}
}