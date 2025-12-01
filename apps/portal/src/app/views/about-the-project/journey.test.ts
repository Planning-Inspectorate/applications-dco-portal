import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
// @ts-expect-error - due to not having @types
import { JourneyResponse } from '@planning-inspectorate/dynamic-forms/src/journey/journey-response.js';
import type { Handler, Request } from 'express';

describe('about the project journey', () => {
	it('should error if used with the wrong router structure', () => {
		assert.throws(() => createJourney('about-the-project', {}, {} as Handler, { baseUrl: '/some/path' } as Request));
		assert.throws(() =>
			// @ts-expect-error - due to mock req not matching Request type
			createJourney('about-the-project', {}, {} as Handler, { baseUrl: '/some/path', params: { id: 'id-1' } })
		);
	});
	it('all questions should be defined', () => {
		const mockReq = { params: { id: 'project-1' }, baseUrl: '/about-the-project' };
		const questions = getQuestions();
		const answers = {};
		const response = new JourneyResponse('about-the-project', 'sess-id', answers);
		// @ts-expect-error - due to mock req not matching Request type
		const journey = createJourney('about-the-project', questions, response, mockReq);
		const sections = journey.sections;

		const questionsDefined = sections.every((s: any) => s.questions.every((q: any) => q !== undefined));
		assert.strictEqual(questionsDefined, true);
	});
});
