/*
  Warnings:

  - Added the required column `blobName` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [blobName] NVARCHAR(1000) NOT NULL,
[size] BIGINT NOT NULL CONSTRAINT [Document_size_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
