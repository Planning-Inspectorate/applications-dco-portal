BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_applicantDetailsId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_caseId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [landRightsInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_landRightsInformationStatusId_df] DEFAULT 'not-started';

-- CreateTable
CREATE TABLE [dbo].[SupportingEvidence] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SupportingEvidence_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [documentId] UNIQUEIDENTIFIER NOT NULL,
    [subCategoryId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SupportingEvidence_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SupportingEvidence_caseId_documentId_subCategoryId_key] UNIQUE NONCLUSTERED ([caseId],[documentId],[subCategoryId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicantDetailsId_fkey] FOREIGN KEY ([applicantDetailsId]) REFERENCES [dbo].[ContactDetails]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_landRightsInformationStatusId_fkey] FOREIGN KEY ([landRightsInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SupportingEvidence] ADD CONSTRAINT [SupportingEvidence_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SupportingEvidence] ADD CONSTRAINT [SupportingEvidence_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[Document]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SupportingEvidence] ADD CONSTRAINT [SupportingEvidence_subCategoryId_fkey] FOREIGN KEY ([subCategoryId]) REFERENCES [dbo].[DocumentSubCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
