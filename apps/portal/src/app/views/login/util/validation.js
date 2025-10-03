export function isValidEmailAddress(emailAddress) {
	return Boolean(emailAddress) && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress);
}

export function isValidOtpCode(otpCode) {
	return (
		Boolean(otpCode) && otpCode.trim().length > 0 && otpCode.trim().length <= 5 && /^[A-Za-z]+$/.test(otpCode.trim())
	);
}

export function isValidOtpRecord(otpRecord) {
	const MAX_ATTEMPTS = 4;
	if (!otpRecord) return false;
	if (otpRecord.attempts >= MAX_ATTEMPTS) return false;
	return new Date() <= new Date(otpRecord.expiresAt);
}
