import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import type { BlobUploadCommonResponse } from '@azure/storage-blob';
import type { Logger } from 'pino';

const commonOptions = { retryOptions: { maxTries: 3 } };

export class BlobStorageClient {
	private logger: Logger;
	private readonly host: string;
	private readonly container: string;
	private blobServiceClient: BlobServiceClient;

	constructor(logger: Logger, host: string, container: string) {
		this.logger = logger;
		this.host = host;
		this.container = container;
		this.blobServiceClient = new BlobServiceClient(this.host, new DefaultAzureCredential(), commonOptions);
	}

	async upload(buffer: Buffer, mimeType: string, path: string): Promise<BlobUploadCommonResponse> {
		try {
			return await this.blobServiceClient
				.getContainerClient(this.container)
				.getBlockBlobClient(path)
				.uploadData(buffer, { blobHTTPHeaders: { blobContentType: mimeType } });
		} catch (e) {
			this.logger.error('Error uploading file to Blob Storage');
			throw e;
		}
	}
}
