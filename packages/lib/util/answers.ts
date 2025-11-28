import type { Response } from 'express';

export function getAnswersFromRes(res: Response) {
	if (!res.locals || !res.locals.journeyResponse) {
		throw new Error('journey response required');
	}
	const journeyResponse = res.locals.journeyResponse;
	const answers = journeyResponse.answers;
	if (typeof answers !== 'object') {
		throw new Error('answers should be an object');
	}
	return answers;
}
