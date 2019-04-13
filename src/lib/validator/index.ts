import * as yup from 'yup'
import { ArraySchemaConstructor } from 'yup'
import { BooleanSchemaConstructor } from 'yup'
import { DateSchemaConstructor } from 'yup'
import { MixedSchemaConstructor } from 'yup'
import { NumberSchemaConstructor } from 'yup'
import { ObjectSchema } from 'yup'
import { ObjectSchemaConstructor } from 'yup'
import { Shape } from 'yup'
import { StringSchemaConstructor } from 'yup'
import { ValidationError as YUPValidationError } from 'yup'
import { ValidationError } from '../errors/ValidationError'
import { ValidationErrors } from '../errors/ValidationError'
import { Context } from '../graphql'

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
	 * Builds the validator shecma.
	 * @method build
	 * @since 1.0.0
	 */
	abstract build(builder: ValidatorBuilder, context: Context): any

	/**
	 * Validates the input using the schema.
	 * @method validate
	 * @since 1.0.0
	 */
	public async validate(input: any, context: Context) {

		try {

			let shape = this.build(yup, context)
			if (shape == null) {
				return
			}

			yup.setLocale({

				mixed: {
					default: context.t('This field is invalid.'),
					required: context.t('This field is required.'),
				},

				string: {
					required: context.t('This field is required.'),
					length: context.t('This field must be exactly ${length} characters.'),
					min: context.t('This field must be at least ${min} characters.'),
					max: context.t('This field must be at most ${max} characters.'),
					matches: context.t('This field must match the following: "${regex}".'),
					email: context.t('This field must be a valid email.'),
					url: context.t('This field must be a valid URL.'),
					trim: context.t('This field must be a trimmed string.'),
					lowercase: context.t('This field must be a lowercase string.'),
					uppercase: context.t('This field must be a upper case string.'),
				},

				number: {
					required: context.t('This field is required.'),
					min: context.t('This field must be greater than or equal to ${min}'),
					max: context.t('This field must be less than or equal to ${max}'),
					lessThan: context.t('This field must be less than ${less}'),
					moreThan: context.t('This field must be greater than ${more}'),
					positive: context.t('This field must be a positive number'),
					negative: context.t('This field must be a negative number'),
					integer: context.t('This field must be an integer'),
				},

				date: {
					required: context.t('This field is required.'),
					min: context.t('This field field must be later than ${min}'),
					max: context.t('This field field must be at earlier than ${max}'),
				},

				array: {
					required: context.t('This field is required.'),
					min: context.t('This field field must have at least ${min} items'),
					max: context.t('This field field must have less than or equal to ${max} items'),
				},

				object: {
					required: context.t('This field is required.'),
					noUnknown: context.t('This field field cannot have keys not specified in the object shape'),
				}
			})

			yup
				.object()
				.shape(shape)
				.validateSync(input, {
					abortEarly: false
				})

		} catch (e) {

			if (e instanceof YUPValidationError) {

				let errors: ValidationErrors = {}

				for (let item of e.inner) {
					errors[item.path] = item.message
				}

				throw new ValidationError(
					context.t('Input validation failed'),
					errors
				)
			}

			throw new ValidationError(e.message)
		}
	}
}
