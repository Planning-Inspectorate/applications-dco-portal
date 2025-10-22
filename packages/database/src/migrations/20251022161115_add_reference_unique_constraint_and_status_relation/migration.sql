/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Case` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [additionalPrescribedInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_additionalPrescribedInformationStatusId_df] DEFAULT 'not-started',
[applicationFormRelatedInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_applicationFormRelatedInformationStatusId_df] DEFAULT 'not-started',
[compulsoryAcquisitionInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_compulsoryAcquisitionInformationStatusId_df] DEFAULT 'not-started',
[consultationReportStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_consultationReportStatusId_df] DEFAULT 'not-started',
[draftDcoStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_draftDcoStatusId_df] DEFAULT 'not-started',
[email] NVARCHAR(1000) NOT NULL,
[environmentalStatementStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_environmentalStatementStatusId_df] DEFAULT 'not-started',
[otherDocumentsStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_otherDocumentsStatusId_df] DEFAULT 'not-started',
[plansAndDrawingsStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_plansAndDrawingsStatusId_df] DEFAULT 'not-started',
[reportsAndStatementsStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_reportsAndStatementsStatusId_df] DEFAULT 'not-started';

-- CreateTable
CREATE TABLE [dbo].[DocumentCategoryStatus] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentCategoryStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_reference_key] UNIQUE NONCLUSTERED ([reference]);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicationFormRelatedInformationStatusId_fkey] FOREIGN KEY ([applicationFormRelatedInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_plansAndDrawingsStatusId_fkey] FOREIGN KEY ([plansAndDrawingsStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_draftDcoStatusId_fkey] FOREIGN KEY ([draftDcoStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_compulsoryAcquisitionInformationStatusId_fkey] FOREIGN KEY ([compulsoryAcquisitionInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_consultationReportStatusId_fkey] FOREIGN KEY ([consultationReportStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_reportsAndStatementsStatusId_fkey] FOREIGN KEY ([reportsAndStatementsStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_environmentalStatementStatusId_fkey] FOREIGN KEY ([environmentalStatementStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_additionalPrescribedInformationStatusId_fkey] FOREIGN KEY ([additionalPrescribedInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_otherDocumentsStatusId_fkey] FOREIGN KEY ([otherDocumentsStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
