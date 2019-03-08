declare module 'merge-graphql-schemas'

/**
 * @type ID
 * @since 1.0.0
 */
type ID = string

/**
 * Express namespace.
 * @namespace Express
 * @since 1.0.0
 */
declare namespace Express {

    /**
     * Express Request extra values.
     * @interface Request
     * @since 1.0.0
     */
    interface Request {

        /**
         * A unique request identifier.
         * @property guid
         * @since 1.0.0
         */
        guid: any

        /**
         * The authorization informations.
         * @property authorization
         * @since 1.0.0
         */
        authorization: {
            scheme: string,
            credentials: string
        }

        /**
         * The request language code.
         * @property lang
         * @since 1.0.0
         */
        lang: string

        /**
         * The gettext function.
         * @property lang
         * @since 1.0.0
         */
        gettext(message: string, context: string): string
    }
}

/**
 * NodeJS namespace.
 * @namespace NodeJS
 * @since 1.0.0
 */
declare namespace NodeJS {

    /**
     * Fixes an annoying problem.
     * @since 1.0.0
     */
    interface Process extends EventEmitter {
        on(event: string | symbol, listener: (...args: any[]) => void): this;
    }
}
