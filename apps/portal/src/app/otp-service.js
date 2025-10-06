import bcrypt from 'bcrypt';

const OTP_LENGTH = 5;
const MAX_ATTEMPTS = 4;
const SALT_ROUNDS = 10;

export function generateOtp() {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let otp = '';
	for (let i = 0; i < OTP_LENGTH; i++) {
		otp += letters.charAt(Math.floor(Math.random() * letters.length));
	}
	return otp;
}

export async function saveOtp(db, email, otp, expiresAt) {
	const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
	await db.oneTimePassword.deleteMany({
		where: { email }
	});
	await db.oneTimePassword.create({
		data: {
			email,
			hashed_otp_code: hashedOtp,
			expiresAt,
			attempts: 0
		}
	});
}

export async function getOtpRecord(db, email) {
	return db.oneTimePassword.findUnique({
		where: { email }
	});
}

export async function deleteOtp(db, email) {
	await db.oneTimePassword.delete({
		where: { email }
	});
}

export async function incrementOtpAttempts(db, email) {
	await db.oneTimePassword.update({
		where: { email },
		data: { attempts: { increment: 1 } }
	});
}

export async function validateOtp(db, email, otp) {
	const record = await getOtpRecord(db, email);

	if (!record) return { valid: false, reason: 'not_found' };
	if (record.attempts >= MAX_ATTEMPTS) return { valid: false, reason: 'too_many_attempts' };
	if (new Date() > new Date(record.expiresAt)) return { valid: false, reason: 'expired' };

	const isMatch = await bcrypt.compare(otp, record.hashed_otp_code);

	if (!isMatch) {
		await incrementOtpAttempts(db, email);
		if (record.attempts + 1 >= MAX_ATTEMPTS) {
			return { valid: false, reason: 'too_many_attempts' };
		}
		return { valid: false, reason: 'invalid' };
	}

	await deleteOtp(db, email);
	return { valid: true };
}
