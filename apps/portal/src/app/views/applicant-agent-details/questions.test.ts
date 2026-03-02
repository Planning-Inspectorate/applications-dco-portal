import { describe, it } from 'node:test';
import assert from 'node:assert';
import { contactDetailsQuestions } from './questions.ts';

describe('applicant-agent-details questions', () => {
	describe('contactDetailsQuestions', () => {
		const prefix = 'applicant';
		const title = 'Applicant';
		it('should create six questions with prefix in question keys', () => {
			const questions = contactDetailsQuestions(prefix, title);

			assert.strictEqual(Object.keys(questions).length, 5);
			for (const key of Object.keys(questions)) {
				assert.ok(key.startsWith(prefix));
			}
		});
		it('should use prefix where appropriate with casing', () => {
			const questions = contactDetailsQuestions(prefix, title);
			for (const question of Object.values(questions)) {
				assert.ok(question.question.includes(prefix));
			}
		});
	});
});
