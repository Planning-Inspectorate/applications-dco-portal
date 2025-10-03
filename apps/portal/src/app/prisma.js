// Prisma client singleton for OTP service
const { PrismaClient } = require('../../../packages/database/src/client');
const prisma = new PrismaClient();
module.exports = prisma;
