/*
  Warnings:

  - The primary key for the `OneTimePassword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `OneTimePassword` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `UniqueIdentifier`.
  - Added the required column `caseId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCertified` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [caseId] UNIQUEIDENTIFIER NOT NULL,
[isCertified] BIT NOT NULL,
[uploadedDate] DATETIME2 NOT NULL CONSTRAINT [Document_uploadedDate_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE [dbo].[OneTimePassword] DROP CONSTRAINT [OneTimePassword_pkey];
ALTER TABLE [dbo].[OneTimePassword] ALTER COLUMN [id] UNIQUEIDENTIFIER NOT NULL;
ALTER TABLE [dbo].[OneTimePassword] ADD CONSTRAINT OneTimePassword_pkey PRIMARY KEY CLUSTERED ([id]), CONSTRAINT [OneTimePassword_id_df] DEFAULT newid() FOR [id];

-- CreateTable
CREATE TABLE [dbo].[Case] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Case_id_df] DEFAULT newid(),
    [reference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Case_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Case_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
