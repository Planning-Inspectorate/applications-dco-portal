/*
  Warnings:

  - A unique constraint covering the columns `[email,caseReference]` on the table `OneTimePassword` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caseReference` to the `OneTimePassword` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[OneTimePassword] DROP CONSTRAINT [OneTimePassword_email_key];

-- AlterTable
ALTER TABLE [dbo].[OneTimePassword] ADD [caseReference] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[OneTimePassword] ADD CONSTRAINT [OneTimePassword_email_caseReference_key] UNIQUE NONCLUSTERED ([email], [caseReference]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
