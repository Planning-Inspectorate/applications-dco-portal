// OTP Service for generating, sending, and validating one-time passwords (OTPs)

import prisma from './prisma.js';
import { GovNotifyClient } from '@pins/dco-portal-lib/govnotify/gov-notify-client.js';

const OTP_LENGTH = 5;
const OTP_EXPIRY_MINUTES = 30;
const MAX_ATTEMPTS = 4;

// Helper to generate a 5-letter uppercase OTP
function generateOtp() {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let otp = '';
	for (let i = 0; i < OTP_LENGTH; i++) {
		otp += letters.charAt(Math.floor(Math.random() * letters.length));
	}
	return otp;
}

// Dependency injection for testing
let _prisma = prisma;
let _GovNotifyClient = GovNotifyClient;

export function __setPrisma(mock) {
	_prisma = mock;
}
export function __setGovNotifyClient(mock) {
	_GovNotifyClient = mock;
}

// Save OTP to database
async function saveOtp(email, otp, expiresAt) {
	// Remove any existing unused/expired OTPs for this email
	await _prisma.otp.deleteMany({
		where: {
			email,
			used: false,
			expiresAt: { lt: new Date() }
		}
	});
	// Create new OTP record
	await _prisma.otp.create({
		data: {
			email,
			code: otp,
			expiresAt,
			used: false,
			attempts: 0
		}
	});
}

// Retrieve OTP record by email
async function getOtpRecord(email) {
	return _prisma.otp.findFirst({
		where: { email },
		orderBy: { createdAt: 'desc' }
	});
}

// Mark OTP as used
async function markOtpUsed(email) {
	await _prisma.otp.updateMany({
		where: { email, used: false },
		data: { used: true }
	});
}

// Increment OTP attempt count
async function incrementOtpAttempts(email) {
	await _prisma.otp.updateMany({
		where: { email, used: false },
		data: { attempts: { increment: 1 } }
	});
}

// Send OTP email using GovNotify
async function sendOtpEmail(email, otp) {
	return _GovNotifyClient.sendEmail({
		emailAddress: email,
		templateId: 'YOUR_OTP_TEMPLATE_ID', // i need to add templeate id here
		personalisation: { code: otp }
	});
}

// Create and send OTP
async function createAndSendOtp(email) {
	const otp = generateOtp();
	const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
	await saveOtp(email, otp, expiresAt);
	await sendOtpEmail(email, otp);
	return otp;
}

// Validate OTP
async function validateOtp(email, otp) {
	const record = await getOtpRecord(email);
	if (!record) return { valid: false, reason: 'not_found' };
	if (record.used) return { valid: false, reason: 'used' };
	if (record.attempts >= MAX_ATTEMPTS) return { valid: false, reason: 'too_many_attempts' };
	if (new Date() > new Date(record.expiresAt)) return { valid: false, reason: 'expired' };
	if (record.code !== otp) {
		await incrementOtpAttempts(email);
		if (record.attempts + 1 >= MAX_ATTEMPTS) {
			return { valid: false, reason: 'too_many_attempts' };
		}
		return { valid: false, reason: 'invalid' };
	}
	await markOtpUsed(email);
	return { valid: true };
}

export { generateOtp, createAndSendOtp, validateOtp, OTP_LENGTH, OTP_EXPIRY_MINUTES, MAX_ATTEMPTS };
