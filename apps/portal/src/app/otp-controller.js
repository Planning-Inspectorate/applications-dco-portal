// OTP Controller: handles OTP-related routes
const otpService = require('./otp-service');

/**
 * Request OTP controller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function requestOtp(req, res) {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ error: 'Email is required.' });
	}
	try {
		await otpService.createAndSendOtp(email);
		return res.status(200).json({ message: 'OTP sent.' });
	} catch {
		return res.status(500).json({ error: 'Failed to send OTP.' });
	}
}

/**
 * Validate OTP controller
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function validateOtp(req, res) {
	const { email, otp } = req.body;
	if (!email || !otp) {
		return res.status(400).json({ error: 'Email and OTP are required.' });
	}
	try {
		const result = await otpService.validateOtp(email, otp);
		if (result.valid) {
			return res.status(200).json({ message: 'OTP valid.' });
		}
		// Map reasons to error messages
		const errorMap = {
			not_found: 'No OTP found for this email.',
			used: 'OTP has already been used.',
			expired: 'OTP has expired.',
			invalid: 'OTP is invalid.',
			too_many_attempts: 'Too many incorrect attempts. Please request a new code.'
		};
		return res.status(400).json({ error: errorMap[result.reason] || 'OTP validation failed.' });
	} catch {
		return res.status(500).json({ error: 'Failed to validate OTP.' });
	}
}

module.exports = {
	requestOtp,
	validateOtp
};
