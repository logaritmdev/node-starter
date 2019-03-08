import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'

/**
 * Common cryptographic functions.
 * @class Crypto
 * @since 1.0.0
 */
export class Crypto {

	/**
	 * Encrypts a string into a hash.
	 * @function encrypt
	 * @since 1.0.0
	 */
	public static async encrypt(pass: string) {
		return bcrypt.hash(pass, 10)
	}

	/**
	 * Compares a string with a hash.
	 * @function compare
	 * @since 1.0.0
	 */
	public static async compare(pass: string, hash: string) {
		return bcrypt.compare(pass, hash)
	}

	/**
	 * Generates a UUID.
	 * @function uuid
	 * @since 1.0.0
	 */
	public static uuid() {
		return uuidv4()
	}
}