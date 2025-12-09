/*
  Warnings:

  - The primary key for the `NsipProject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `caseId` on the `NsipProject` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[NsipProject] DROP CONSTRAINT [NsipProject_pkey];
ALTER TABLE [dbo].[NsipProject] ALTER COLUMN [caseId] INT NOT NULL;
ALTER TABLE [dbo].[NsipProject] ADD CONSTRAINT NsipProject_pkey PRIMARY KEY CLUSTERED ([caseId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
