export default require('i18n-abide').abide({
	supported_languages: ['fr', 'en'],
	default_lang: 'en-CA',
	debug_lang: 'en-CA',
	translation_directory: __dirname + '/../i18n'
})
