// @ts-expect-error - due to not having @types
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function mockOtpCode(code: string) {
	return await bcrypt.hash(code, SALT_ROUNDS);
}
