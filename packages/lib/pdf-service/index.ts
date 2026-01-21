import { PdfServiceClient } from './pdf-service-client.ts';
import type { PdfServiceConfig } from './types.d.ts';
import type { Logger } from 'pino';

export function initPdfService(config: PdfServiceConfig, logger: Logger): PdfServiceClient | null {
	if (!config.url) {
		return null;
	}

	return new PdfServiceClient(logger, config.url);
}
