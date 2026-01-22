import type { Logger } from 'pino';

export class PdfServiceClient {
	private logger: Logger;
	private baseUrl: string;

	constructor(logger: Logger, baseUrl: string) {
		this.logger = logger;
		this.baseUrl = baseUrl;
	}

	async generatePdf(html: string): Promise<Blob> {
		const url = `${this.baseUrl}/api/v1/generate`;

		let apiResponse;
		try {
			apiResponse = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/pdf'
				},
				body: JSON.stringify({ html })
			});
		} catch (err) {
			this.logger.error(err);
			let errorMessage = err instanceof Error ? err.message : '';
			throw new Error('Error during PdfServiceClient generatePdf: ' + errorMessage);
		}

		if (!apiResponse.ok || apiResponse.status !== 200) {
			this.logger.debug(apiResponse, 'PdfServiceClient generatePdf API Response not Ok');
			throw new Error(apiResponse.statusText);
		}

		this.logger.info('PdfServiceClient: pdf successfully generated.');
		return apiResponse.blob();
	}
}
