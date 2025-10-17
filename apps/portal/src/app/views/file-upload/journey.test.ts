import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
// @ts-expect-error - due to not having @types
import { JourneyResponse } from '@planning-inspectorate/dynamic-forms/src/journey/journey-response.js';
import type { Handler, Request } from 'express';

describe('case details journey', () => {
	it('should error if used with the wrong router structure', () => {
		assert.throws(() => createJourney('draft-dco', {}, {} as Handler, { baseUrl: '/some/path' } as Request));
		assert.throws(() =>
			// @ts-expect-error - due to mock req not matching Request type
			createJourney('draft-dco', {}, {} as Handler, { baseUrl: '/some/path', params: { id: 'id-1' } })
		);
	});
	it('all questions should be defined', () => {
		const mockReq = { params: { id: 'project-1' }, baseUrl: '/draft-dco' };
		const questions = getQuestions('draft-dco');
		const answers = {};
		const response = new JourneyResponse('draft-dco', 'sess-id', answers);
		// @ts-expect-error - due to mock req not matching Request type
		const journey = createJourney('draft-dco', questions, response, mockReq);
		const sections = journey.sections;

		const questionsDefined = sections.every((s: any) => s.questions.every((q: any) => q !== undefined));
		assert.strictEqual(questionsDefined, true);
	});
});
