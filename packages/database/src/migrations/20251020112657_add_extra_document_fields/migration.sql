/*
  Warnings:

  - Added the required column `isCertified` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [isCertified] BIT NOT NULL,
[uploadedDate] DATETIME2 NOT NULL CONSTRAINT [Document_uploadedDate_df] DEFAULT CURRENT_TIMESTAMP;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
