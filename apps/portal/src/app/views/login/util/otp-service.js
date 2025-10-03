import bcrypt from 'bcrypt';
import { addMinutes } from 'date-fns';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const OTP_LENGTH = 5;
const SALT_ROUNDS = 10;
const TTL = 30;

export function generateOtp() {
	const bytes = new Uint8Array(OTP_LENGTH);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

export async function saveOtp(db, email, otp) {
	const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
	await db.oneTimePassword.deleteMany({
		where: { email }
	});
	await db.oneTimePassword.create({
		data: {
			email,
			hashedOtpCode: hashedOtp,
			expiresAt: addMinutes(new Date(), TTL),
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
