/*
  Warnings:

  - The primary key for the `NsipServiceUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[NsipServiceUser] DROP CONSTRAINT [NsipServiceUser_caseReference_email_key];

-- AlterTable
ALTER TABLE [dbo].[NsipServiceUser] DROP CONSTRAINT [NsipServiceUser_pkey];
ALTER TABLE [dbo].[NsipServiceUser] ADD CONSTRAINT NsipServiceUser_pkey PRIMARY KEY CLUSTERED ([caseReference],[email]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
