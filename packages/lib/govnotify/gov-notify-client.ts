// @ts-expect-error - due to not having @types
import { NotifyClient } from 'notifications-node-client';
import type { Logger } from 'pino';
import type { GovNotifyOptions, TemplateIds } from './types.d.ts';

export const TEAM_EMAIL_ADDRESS = 'enquiries@planninginspectorate.gov.uk';
export const DEFAULT_PROJECT_EMAIL_ADDRESS = 'nienquiries@planninginspectorate.gov.uk';

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
		await this.sendEmail(this.#templateIds.oneTimePasswordNotification as string, email, {
			personalisation: personalisation
		});
		this.logger.info('OTP email template successfully dispatched');
	}

	async sendWhitelistAddNotification(email: string, personalisation: { [key: string]: string }): Promise<void> {
		this.logger.info('Dispatching whitelist user added email template');
		await this.sendEmail(this.#templateIds.whitelistAddNotification as string, email, {
			personalisation: personalisation
		});
		this.logger.info('Whitelist user added email template successfully dispatched');
	}

	async sendWhitelistAccessChangedNotification(
		email: string,
		personalisation: { [key: string]: string }
	): Promise<void> {
		this.logger.info('Dispatching whitelist access changed email template');
		await this.sendEmail(this.#templateIds.whitelistAccessChangedNotification as string, email, {
			personalisation: personalisation
		});
		this.logger.info('Whitelist access changed email template successfully dispatched');
	}

	async sendWhitelistRemoveNotification(email: string, personalisation: { [key: string]: string }): Promise<void> {
		this.logger.info('Dispatching whitelist remove email template');
		await this.sendEmail(this.#templateIds.whitelistRemoveNotification as string, email, {
			personalisation: personalisation
		});
		this.logger.info('Whitelist remove email template successfully dispatched');
	}

	async sendAntiVirusFailedNotification(email: string, personalisation: { [key: string]: string }): Promise<void> {
		this.logger.info('Dispatching anti virus failed email template');
		await this.sendEmail(this.#templateIds.antiVirusFailedNotification as string, email, {
			personalisation: personalisation
		});
		this.logger.info('Anti virus failed email template successfully dispatched');
	}

	async sendApplicantSubmissionNotification(email: string, caseReference: string, pdfFile: Buffer): Promise<void> {
		this.logger.info('Dispatching applicant data submission email template');
		await this.sendEmail(this.#templateIds.applicantSubmissionNotification as string, email, {
			personalisation: {
				number_of_days: '28',
				case_reference_number: caseReference,
				pdfLink: this.notifyClient.prepareUpload(pdfFile, { filename: 'dco-portal-sub.pdf' }), //TODO: update pdf link once pdf is created and saved in blob store
				relevant_team_email_address: TEAM_EMAIL_ADDRESS
			}
		});
		this.logger.info('Applicant data submission email template successfully dispatched');
	}

	async sendPinsStaffSubmissionNotification(email: string, caseReference: string, pdfFile: Buffer): Promise<void> {
		this.logger.info('Dispatching Planning Inspectorate staff data submission email template');
		await this.sendEmail(this.#templateIds.pinsStaffSubmissionNotification as string, email, {
			personalisation: {
				case_reference_number: caseReference,
				pdfLink: this.notifyClient.prepareUpload(pdfFile, { filename: 'dco-portal-sub.pdf' }) //TODO: update pdf link once pdf is created and saved in blob store
			}
		});
		this.logger.info('Planning Inspectorate staff data submission email template successfully dispatched');
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
