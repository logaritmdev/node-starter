import config from 'config'
import jwt from 'jsonwebtoken'

/**
 * Token management class.
 * @class Token
 * @since 1.0.0
 */
export class Token {

	/**
	 * Creates a JWT token.
	 * @function sign
	 * @since 1.0.0
	 */
	public static async sign(data: any) {

		let secret = config.get<string>('jwt.secret')
		if (secret == null) {
			throw new Error(`
				Token Error:
				The JWT secret has not been set.
			`)
		}

		return new Promise<string>((success, failure) => {
			jwt.sign(data, secret, (err: any, res: string) => err ? failure(err) : success(res))
		})
	}

	/**
	 * Verifies a JWT token.
	 * @function verify
	 * @since 1.0.0
	 */
	public static async verify(token: string) {

		let secret = config.get('jwt.secret')
		if (secret == null) {
			throw new Error(`
				Token Error:
				The JWT secret has not been set.
			`)
		}

		return new Promise<boolean>((success, failure) => {
			jwt.verify(token, config.get('jwt.secret'), (err) => err ? success(false) : success(true))
		})
	}
}