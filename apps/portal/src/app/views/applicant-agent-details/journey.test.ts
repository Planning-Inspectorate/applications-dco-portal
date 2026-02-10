import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createJourney } from './journey.ts';
import { getQuestions } from './questions.ts';
import { JourneyResponse } from '@planning-inspectorate/dynamic-forms';
import type { Handler, Request } from 'express';

describe('applicant agent details journey', () => {
	it('should error if used with the wrong router structure', () => {
		assert.throws(() =>
			createJourney('applicant-and-agent-details', {}, {} as Handler, { baseUrl: '/some/path' } as Request)
		);
		assert.throws(() =>
			// @ts-expect-error - due to mock req not matching Request type
			createJourney('applicant-and-agent-details', {}, {} as Handler, { baseUrl: '/some/path', params: { id: 'id-1' } })
		);
	});
	it('all questions should be defined', () => {
		const mockReq = { params: { id: 'project-1' }, baseUrl: '/applicant-and-agent-details' };
		const questions = getQuestions();
		const answers = {};
		const response = new JourneyResponse('applicant-and-agent-details', 'sess-id', answers);
		// @ts-expect-error - due to mock req not matching Request type
		const journey = createJourney('applicant-and-agent-details', questions, response, mockReq);
		const sections = journey.sections;

		const questionsDefined = sections.every((s: any) => s.questions.every((q: any) => q !== undefined));
		assert.strictEqual(questionsDefined, true);
	});
	it('cbos prepopulated questions should have the requisite html property', () => {
		const mockReq = {
			params: { id: 'project-1' },
			baseUrl: '/about-the-project',
			session: {
				cbosPopulated: {
					applicantName: true,
					applicantOrganisation: true,
					applicantAddress: true,
					applicantEmailAddress: false
				}
			}
		};
		const questions = getQuestions();
		const answers = {};
		const response = new JourneyResponse('about-the-project', 'sess-id', answers);
		// @ts-expect-error - due to mock req not matching Request type
		const journey = createJourney('about-the-project', questions, response, mockReq);
		const sections = journey.sections;

		const questionsWithHtml = sections.reduce(
			(acc: number, s: any) => (acc += s.questions.filter((q: any) => !!q.html).length),
			0
		);
		assert.strictEqual(questionsWithHtml, 3);
	});
});
