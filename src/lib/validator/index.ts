import * as yup from 'yup'
import { ArraySchemaConstructor } from 'yup'
import { BooleanSchemaConstructor } from 'yup'
import { DateSchemaConstructor } from 'yup'
import { MixedSchemaConstructor } from 'yup'
import { NumberSchemaConstructor } from 'yup'
import { ObjectSchemaConstructor } from 'yup'
import { StringSchemaConstructor } from 'yup'
import { ValidationError as YUPValidationError } from 'yup'
import { Context } from 'lib/graphql'
import { FieldValidationErrors } from 'lib/errors/ValidationError'
import { ValidationError } from 'lib/errors/ValidationError'

/**
 * The validator builder.
 * @interface ValidatorBuilder
 * @since 1.0.0
 */
export interface ValidatorBuilder {
	object: ObjectSchemaConstructor
	string: StringSchemaConstructor
	number: NumberSchemaConstructor
	mixed: MixedSchemaConstructor
	array: ArraySchemaConstructor
	boolean: BooleanSchemaConstructor
	date: DateSchemaConstructor
}

/**
 * The base class for a yup based validator.
 * @class Validator
 * @since 1.0.0
 */
export abstract class Validator {

	/**
	 * The validator's context.
	 * @property context
	 * @since 1.0.0
	 */
	public context: Context

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(context: Context) {

		this.context = context

		yup.setLocale({

			mixed: {
				default: this.context.t('This field is invalid.'),
				required: this.context.t('This field is required.'),
			},

			string: {
				length: this.context.t('This field must be exactly ${length} characters.'),
				min: this.context.t('This field must be at least ${min} characters.'),
				max: this.context.t('This field must be at most ${max} characters.'),
				matches: this.context.t('This field must match the following: "${regex}".'),
				email: this.context.t('This field must be a valid email.'),
				url: this.context.t('This field must be a valid URL.'),
				trim: this.context.t('This field must be a trimmed string.'),
				lowercase: this.context.t('This field must be a lowercase string.'),
				uppercase: this.context.t('This field must be a upper case string.'),
			},

			number: {
				min: this.context.t('This field must be greater than or equal to ${min}'),
				max: this.context.t('This field must be less than or equal to ${max}'),
				lessThan: this.context.t('This field must be less than ${less}'),
				moreThan: this.context.t('This field must be greater than ${more}'),
				positive: this.context.t('This field must be a positive number'),
				negative: this.context.t('This field must be a negative number'),
				integer: this.context.t('This field must be an integer'),
			},

			date: {
				min: this.context.t('This field field must be later than ${min}'),
				max: this.context.t('This field field must be at earlier than ${max}'),
			},

			array: {
				min: this.context.t('This field field must have at least ${min} items'),
				max: this.context.t('This field field must have less than or equal to ${max} items'),
			},

			object: {
				noUnknown: this.context.t('This field field cannot have keys not specified in the object shape'),
			}
		})
	}

	/**
	 * Builds the validator shecma.
	 * @method build
	 * @since 1.0.0
	 */
	public abstract build(builder: ValidatorBuilder): any

	/**
	 * Validates the input using the schema.
	 * @method validate
	 * @since 1.0.0
	 */
	public async validate(input: any) {

		try {

			let shape = this.build(yup)
			if (shape == null) {
				return
			}

			yup
				.object()
				.shape(shape)
				.validateSync(input, {
					abortEarly: false
				})

		} catch (e) {

			if (e instanceof YUPValidationError) {

				let fields: FieldValidationErrors = {}

				for (let item of e.inner) {
					fields[item.path] = item.message
				}

				return new ValidationError(
					this.context.t('Validation failed'),
					fields
				)
			}

			return new ValidationError(e.message)
		}

		return null
	}

	/**
	 * Convenience method to raise an error.
	 * @method raise
	 * @since 1.0.0
	 */
	public raise(error: string | null, fields: FieldValidationErrors = {}) {

		if (error == null) {
			error = this.context.t('Validation failed')
		}

		return new ValidationError(error, fields)
	}
}
