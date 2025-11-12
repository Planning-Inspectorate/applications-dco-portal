/*
  Warnings:

  - You are about to drop the column `caseId` on the `ContactDetails` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ContactDetails] DROP CONSTRAINT [ContactDetails_caseId_fkey];

-- DropIndex
ALTER TABLE [dbo].[ContactDetails] DROP CONSTRAINT [ContactDetails_caseId_key];

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [applicantDetailsId] UNIQUEIDENTIFIER;

-- AlterTable
ALTER TABLE [dbo].[ContactDetails] DROP COLUMN [caseId];

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicantDetailsId_fkey] FOREIGN KEY ([applicantDetailsId]) REFERENCES [dbo].[ContactDetails]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
