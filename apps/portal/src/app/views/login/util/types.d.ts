export interface OtpRecord {
	id: string;
	email: string;
	hashedOtpCode: string;
	createdAt: Date;
	expiresAt: Date;
	attempts: number;
}
