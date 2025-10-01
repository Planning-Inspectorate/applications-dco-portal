import { NotifyClient } from 'notifications-node-client';

/**
 * @typedef {import('./types.js').GovNotifyOptions} GovNotifyOptions
 */

export class GovNotifyClient {
	/** @type {import('./types.js').TemplateIds} */
	#templateIds;

	/**
	 * @param {import('pino').Logger} logger
	 * @param {string} govNotifyApiKey - Gov Notify API key
	 * @param {import('./types.js').TemplateIds} templateIds
	 **/
	constructor(logger, govNotifyApiKey, templateIds) {
		this.logger = logger;
		this.notifyClient = new NotifyClient(govNotifyApiKey);
		this.#templateIds = templateIds;
	}

	/**
	 * @param {string} email - recipients email address
	 * @param {import('./types.js').CommonNotificationPersonalisation} personalisation
	 * @returns {Promise<void>}
	 */
	async sendOneTimePasswordLoginNotification(email, personalisation) {
		await this.sendEmail(this.#templateIds.oneTimePasswordLoginNotification, email, {
			personalisation: personalisation
		});
	}

	/**
	 * @param {string} templateId - Gov Notify email template id
	 * @param {string} emailAddress - Recipients email address
	 * @param {GovNotifyOptions} options - Options to pass to Gov Notify
	 **/
	async sendEmail(templateId, emailAddress, options) {
		try {
			this.logger.info(`dispatching email template: ${templateId}`);
			await this.notifyClient.sendEmail(templateId, emailAddress, options);
		} catch (e) {
			this.logger.error({ error: e, templateId, message: e.response?.data?.errors }, 'failed to dispatch email');
			throw new Error(`email failed to dispatch: ${e.message}`);
		}
	}
}
