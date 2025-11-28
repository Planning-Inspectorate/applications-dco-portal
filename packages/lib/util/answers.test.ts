// @ts-nocheck

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAnswersFromRes } from './answers.ts';

describe('getAnswersFromRes', () => {
	describe('getAnswersFromRes', () => {
		it('should return answers if present in journeyResponse', async () => {
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: {
							firstName: 'test',
							lastName: 'name',
							emailAddress: 'test@email.com'
						}
					}
				}
			};

			assert.deepStrictEqual(getAnswersFromRes(mockRes), {
				firstName: 'test',
				lastName: 'name',
				emailAddress: 'test@email.com'
			});
		});
		it('should throw an error if res.locals is not present', async () => {
			assert.throws(() => getAnswersFromRes({}));
		});
		it('should throw an error if res.locals.journeyResponse is not present', async () => {
			assert.throws(() => getAnswersFromRes({ locals: {} }));
		});
		it('should throw an error if answers is not an object', async () => {
			const mockRes = {
				locals: {
					journeyResponse: {
						answers: 'invalid value'
					}
				}
			};
			assert.throws(() => getAnswersFromRes(mockRes));
		});
	});
});
