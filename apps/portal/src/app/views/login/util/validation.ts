import { differenceInSeconds } from 'date-fns';
import type { OtpRecord } from './types.d.ts';

export function isValidEmailAddress(emailAddress: string): boolean {
	return Boolean(emailAddress) && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress);
}

export function isValidOtpCode(otpCode: string): boolean {
	return (
		Boolean(otpCode) && otpCode.trim().length > 0 && otpCode.trim().length <= 5 && /^[A-Za-z]+$/.test(otpCode.trim())
	);
}

export function isValidOtpRecord(otpRecord: OtpRecord | undefined | null): boolean {
	const MAX_ATTEMPTS = 3;
	if (!otpRecord) return false;
	if (otpRecord.attempts >= MAX_ATTEMPTS) return false;
	return new Date() <= new Date(otpRecord.expiresAt);
}

export function sentInLastTenSeconds(otpRecord: OtpRecord) {
	if (!otpRecord) return false;
	const diff = differenceInSeconds(new Date(), otpRecord.createdAt);
	return diff >= 0 && diff <= 10;
}

export function isValidCaseReference(caseReference: string): boolean {
	return Boolean(caseReference) && /^[A-Za-z]{2}\d{6}$/.test(caseReference);
}
