/*
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import type {
	BlockBlobClient,
	BlobUploadCommonResponse,
	BlobDownloadResponseParsed,
	BlobDeleteIfExistsResponse,
	BlockBlobUploadStreamOptions,
	BlobItem
} from '@azure/storage-blob';
 */
import type { Logger } from 'pino';

//const commonOptions = { retryOptions: { maxTries: 3 } };

export class PuppeteerClient {
	private logger: Logger;
	private readonly host: string;
	private readonly container: string;
	//private puppeteerServiceClient: BlobServiceClient;

	constructor(logger: Logger, host: string, container: string, connectionString?: string) {
		this.logger = logger;
		this.host = host;
		this.container = container;
		if (connectionString) {
			//this.puppeteerServiceClient = BlobServiceClient.fromConnectionString(connectionString);
		} else {
			//this.puppeteerServiceClient = new BlobServiceClient(this.host, new DefaultAzureCredential(), commonOptions);
		}
	}
}
