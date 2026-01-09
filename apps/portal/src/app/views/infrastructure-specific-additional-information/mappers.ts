// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import type { NonOffshoreGeneratingStationInput } from './types.d.ts';

export function mapAnswersToNonOffshoreGeneratingStation(
	answers: Record<string, any>,
	caseId: string
): NonOffshoreGeneratingStationInput {
	console.log(answers.electicityGrid);
	return {
		electricityGrid: answers.electricityGrid,
		gasFuelledGeneratingStation: answers.gasFuelledGeneratingStation === BOOLEAN_OPTIONS.YES ? true : false,
		gasPipelineConnection: answers.gasPipelineConnection,
		caseId: caseId
	};
}
