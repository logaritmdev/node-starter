import config from 'config'
import mailer from 'nodemailer'
import EmailTemplates from 'swig-email-templates'

/**
 * The mail function options.
 * @interface MailOptions
 * @since 1.0.0
 */
export interface MailOptions {
	file: string
	vars: any
}

/**
 * A wrapper around node mailer.
 * @class Mailer
 * @since 1.0.0
 */
export class Mailer {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * @property main
	 * @since 1.0.0
	 * @hidden
	 */
	private static main: Mailer = new Mailer()

	/**
	 * Sends the email
	 * @method send
	 * @since 1.0.0
	 */
	public static send(to: string, options: MailOptions) {
		this.main.send(to, options)
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * @property template
	 * @since 1.0.0
	 * @hidden
	 */
	private templates: EmailTemplates

	/**
	 * @property transport
	 * @since 1.0.0
	 * @hidden
	 */
	private transport: any

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor() {

		this.templates = new EmailTemplates({ root: config.get<string>('mailer.template_dir'), swig: { cache: false } } as any)

		/*
		 * Initialize the transport. Customise this to fit your
		 * mailing needs.
		 */

		const user = config.get<string>('mailer.smtp_user')
		const pass = config.get<string>('mailer.smtp_pass')
		const auth = user ? { user, pass } : undefined

		switch (process.env.NODE_ENV) {

			case 'development':

				this.transport = mailer.createTransport({
					host: config.get<string>('mailer.smtp_host'),
					port: config.get<number>('mailer.smtp_port'),
					auth: auth,
				})

				break

			case 'production':

				this.transport = mailer.createTransport({
					host: config.get<string>('mailer.smtp_host'),
					port: config.get<number>('mailer.smtp_port'),
					auth: auth,
				})

				break
		}
	}

	/**
	 * Sends the email
	 * @method send
	 * @since 1.0.0
	 */
	public async send(to: string, options: MailOptions) {

		try {

			let [html, text, subject] = await this.render(options.file, options.vars)

			if (subject == null) {
				console.error('Unable to send mail, subject is missing')
				return
			}

			this.transport.sendMail({
				to,
				from: config.get<string>('mailer.smtp_from'),
				subject,
				html,
				text
			})

			return true

		} catch (e) {
			console.error(e)
		}

		return false
	}

	/**
	 * @method render
	 * @since 1.0.0
	 * @hidden
	 */
	private render(file: string, vars: any) {
		return new Promise<Array<string | undefined>>((success, failure) => {
			this.templates.render(file, vars, (err, html, text, subject) => err ? failure(err) : success([html, text, subject]))
		})
	}
}