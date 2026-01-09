// @ts-expect-error - due to not having @types
import { BOOLEAN_OPTIONS } from '@planning-inspectorate/dynamic-forms/src/components/boolean/question.js';
import type { OffshoreGeneratingStationInput } from './types.d.ts';

export function mapAnswersToOffshoreGeneratingStation(
	answers: Record<string, any>,
	caseId: string
): OffshoreGeneratingStationInput {
	return {
		cableInstallation: answers.cableInstallation,
		safetyZones: answers.safetyZones,
		caseId: caseId
	};
}
