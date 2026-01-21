import { PdfService } from '#service';
import type { Request, Response } from 'express';

export function postGeneratePdf(service: PdfService) {
	return async (req: Request, res: Response) => {
		res.send('winner winner');
	};
}
