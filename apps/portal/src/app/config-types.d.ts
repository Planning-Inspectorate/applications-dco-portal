import type { NotifyConfig, ServiceBusConfig } from '@pins/dco-portal-lib/govnotify/types';
import type { BlobStoreConfig } from '@pins/dco-portal-lib/blob-store/types';
import type { PdfServiceConfig } from '@pins/dco-portal-lib/pdf-service/types.js';
import type { BaseConfig } from '@planning-inspectorate/core/app';

interface Config extends BaseConfig {
	appHostname: string;
	blobStore: BlobStoreConfig;
	pdf: PdfServiceConfig;
	govNotify: NotifyConfig;
	isApplicationEnabled: boolean;
	serviceBus: ServiceBusConfig;
	enableE2eTestEndpoints: boolean;
	testToolsToken?: string;
}
