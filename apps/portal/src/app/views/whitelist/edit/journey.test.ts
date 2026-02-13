import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createJourney, JOURNEY_ID } from './journey.ts';
import { getQuestions } from './questions.ts';
import { JourneyResponse } from '@planning-inspectorate/dynamic-forms';
import type { Handler, Request } from 'express';

describe('whitelist edit user journey', () => {
	it('should error if used with the wrong router structure', () => {
		assert.throws(() => createJourney({}, {} as Handler, { baseUrl: '/some/path' } as Request));
		assert.throws(() =>
			// @ts-expect-error - due to mock req not matching Request type
			createJourney({}, {} as Handler, { baseUrl: '/some/path', params: { id: 'id-1' } })
		);
	});
	it('all questions should be defined', () => {
		const mockReq = { params: { id: 'project-1' }, baseUrl: '/edit-user' };
		const questions = getQuestions();
		const answers = {};
		const response = new JourneyResponse(JOURNEY_ID, 'sess-id', answers);
		// @ts-expect-error - due to mock req not matching Request type
		const journey = createJourney(questions, response, mockReq);
		const sections = journey.sections;

		const questionsDefined = sections.every((s: any) => s.questions.every((q: any) => q !== undefined));
		assert.strictEqual(questionsDefined, true);
	});
});
