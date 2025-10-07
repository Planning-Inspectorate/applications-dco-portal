interface OtpRecord {
	id: string;
	email: string;
	hashedOtpCode: String;
	createdAt: Date;
	expiresAt: Date;
	attempts: number;
}
