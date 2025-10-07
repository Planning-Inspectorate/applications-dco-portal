import { NotifyClient } from 'notifications-node-client';
import type { Logger } from 'pino';
import type { GovNotifyOptions, TemplateIds } from './types.d.ts';

export class GovNotifyClient {
	#templateIds: TemplateIds;
	private logger: Logger;
	private notifyClient: NotifyClient;

	constructor(logger: Logger, govNotifyApiKey: string, templateIds: TemplateIds) {
		this.logger = logger;
		this.notifyClient = new NotifyClient(govNotifyApiKey);
		this.#templateIds = templateIds;
	}

	async sendOneTimePasswordNotification(email: string, personalisation: { [key: string]: string }): Promise<void> {
		await this.sendEmail(this.#templateIds.oneTimePasswordNotification, email, {
			personalisation: personalisation
		});
	}

	async sendEmail(templateId: string, emailAddress: string, options: GovNotifyOptions): Promise<void> {
		try {
			this.logger.info(`dispatching email template: ${templateId}`);
			await this.notifyClient.sendEmail(templateId, emailAddress, options);
		} catch (e: any) {
			throw new Error(`email failed to dispatch: ${e.message}`);
		}
	}
}
