// @ts-expect-error - due to not having @types
import { NotifyClient } from 'notifications-node-client';
import type { Logger } from 'pino';
import type { GovNotifyOptions, TemplateIds } from './types.d.ts';

export const TEAM_EMAIL_ADDRESS = 'enquiries@planninginspectorate.gov.uk';

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
		this.logger.info('Dispatching OTP email template');
		await this.sendEmail(this.#templateIds.oneTimePasswordNotification, email, {
			personalisation: personalisation
		});
		this.logger.info('OTP email template successfully dispatched');
	}

	async sendWhitelistAddNotification(email: string, personalisation: { [key: string]: string }): Promise<void> {
		this.logger.info('Dispatching whitelist user added email template');
		await this.sendEmail(this.#templateIds.whitelistAddNotification, email, {
			personalisation: personalisation
		});
		this.logger.info('Whitelist user added email template successfully dispatched');
	}

	async sendWhitelistAccessChangedNotification(
		email: string,
		personalisation: { [key: string]: string }
	): Promise<void> {
		this.logger.info('Dispatching whitelist access changed email template');
		await this.sendEmail(this.#templateIds.whitelistAccessChangedNotification, email, {
			personalisation: personalisation
		});
		this.logger.info('Whitelist access changed email template successfully dispatched');
	}

	async sendWhitelistRemoveNotification(email: string, personalisation: { [key: string]: string }): Promise<void> {
		this.logger.info('Dispatching whitelist remove email template');
		await this.sendEmail(this.#templateIds.whitelistRemoveNotification, email, {
			personalisation: personalisation
		});
		this.logger.info('Whitelist remove email template successfully dispatched');
	}

	async sendEmail(templateId: string, emailAddress: string, options: GovNotifyOptions): Promise<void> {
		try {
			await this.notifyClient.sendEmail(templateId, emailAddress, options);
		} catch (e) {
			this.logger.error({ e }, 'Error dispatching email');
			throw new Error('Email failed to dispatch');
		}
	}
}
