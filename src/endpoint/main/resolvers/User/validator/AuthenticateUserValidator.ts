import { Validator } from 'lib/validator'
import { ValidatorBuilder } from 'lib/validator'
import { AuthenticateUserInput } from 'endpoint/main/types'

export class AuthenticateUserValidator extends Validator {

	/**
	 * @inherited
	 * @method build
	 * @sine 1.0.0
	 */
	public build(builder: ValidatorBuilder) {

		return {

			email: builder
				.string()
				.required()
				.max(255),

			passw: builder
				.string()
				.required()
				.max(255)
		}
	}

	/**
	 * @inherited
	 * @method validate
	 * @sine 1.0.0
	 */
	public async validate(values: AuthenticateUserInput) {

		let errors = await super.validate(values)
		if (errors) {
			return errors
		}

		/*
		 * Run custom validation here.
		 */

		return null
	}
}