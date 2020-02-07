import { ApolloError } from 'apollo-server-express'

/**
 * The field errors.
 * @class FieldValidationErrors
 * @since 1.0.0
 */
export type FieldValidationErrors = {
	[key: string]: string
}

/**
 * Thrown when a validation error occurs.
 * @class ValidationError
 * @since 1.0.0
 */
export class ValidationError extends ApolloError {

	/**
	 * The error name.
	 * @property name
	 * @since 1.0.0
	 */
	readonly name: string = 'ValidationError'

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(message: string, fields?: FieldValidationErrors) {
		super(message, 'INPUT_VALIDATION_ERROR', { fields })
	}
}