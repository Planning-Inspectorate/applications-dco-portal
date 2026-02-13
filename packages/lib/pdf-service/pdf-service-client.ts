import type { Logger } from 'pino';

export class PdfServiceClient {
	private logger: Logger;
	private baseUrl: string;

	constructor(logger: Logger, baseUrl: string) {
		this.logger = logger;
		this.baseUrl = baseUrl;
	}

	async generatePdf(html: string): Promise<Buffer<ArrayBuffer>> {
		const url = `${this.baseUrl}/api/v1/generate`;
		this.logger.info('Generating pdf file');

		let apiResponse;
		console.log('url');
		console.log(url);
		console.log('body');
		console.log(JSON.stringify({ html }));
		try {
			apiResponse = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({ html })
			});
		} catch (err) {
			this.logger.error(err);
			const errorMessage = err instanceof Error ? err.message : '';
			throw new Error('pdf-service-api generatePdf error: ' + errorMessage);
		}

		console.log('api response');
		console.log(apiResponse);
		if (!apiResponse.ok || apiResponse.status !== 200) {
			this.logger.error(apiResponse, 'PdfServiceClient generatePdf API Response not Ok');
			throw new Error(
				apiResponse.statusText
					? apiResponse.statusText
					: 'pdf-service-api generatePdf error: status ' + apiResponse.status
			);
		}

		this.logger.info('PdfServiceClient: pdf successfully generated.');
		return Buffer.from(await apiResponse.arrayBuffer());
	}
}
