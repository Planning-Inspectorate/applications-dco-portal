export interface GovNotifyOptions {
	personalisation: {
		[key: string]: string;
	};
	reference?: string;
	oneClickUnsubscribeURL?: string;
	emailReplyToId?: string;
}

export interface TemplateIds {
	oneTimePasswordNotification: string;
	whitelistAddNotification: string;
	whitelistAccessChangedNotification: string;
	whitelistRemoveNotification: string;
}

export interface NotifyConfig {
	disabled: boolean;
	apiKey: string;
	templateIds: TemplateIds;
}
