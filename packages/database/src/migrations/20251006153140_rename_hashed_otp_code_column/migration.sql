/*
  Warnings:

  - You are about to drop the column `hashed_otp_code` on the `OneTimePassword` table. All the data in the column will be lost.
  - Added the required column `hashedOtpCode` to the `OneTimePassword` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[OneTimePassword] DROP COLUMN [hashed_otp_code];
ALTER TABLE [dbo].[OneTimePassword] ADD [hashedOtpCode] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
