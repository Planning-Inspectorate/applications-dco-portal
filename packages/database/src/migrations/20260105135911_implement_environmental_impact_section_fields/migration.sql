BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [environmentalImpactAssessmentInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_environmentalImpactAssessmentInformationStatusId_df] DEFAULT 'not-started',
[notifiedOtherPeople] BIT;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_environmentalImpactAssessmentInformationStatusId_fkey] FOREIGN KEY ([environmentalImpactAssessmentInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
