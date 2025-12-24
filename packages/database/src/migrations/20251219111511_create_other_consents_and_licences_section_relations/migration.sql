BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [otherConsentsDescription] NVARCHAR(2000),
[otherConsentsOrLicencesDetailsStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_otherConsentsOrLicencesDetailsStatusId_df] DEFAULT 'not-started';

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_otherConsentsOrLicencesDetailsStatusId_fkey] FOREIGN KEY ([otherConsentsOrLicencesDetailsStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
