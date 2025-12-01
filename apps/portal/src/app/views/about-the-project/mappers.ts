import type { AboutTheProjectInput } from './types.js';

export function mapAnswersToCase(answers: Record<string, any>): AboutTheProjectInput {
	return {
		projectDescription: answers.description
	};
}
