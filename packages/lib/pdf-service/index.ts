import { PdfServiceClient } from './pdf-service-client.ts';
import type { pdfServiceConfig } from './types.d.ts';
import type { Logger } from 'pino';

export function initPdfService(config: pdfServiceConfig, logger: Logger): PdfServiceClient | null {
	if (!config?.url) {
		return null;
	}

	return new PdfServiceClient(logger, config.url);
}
