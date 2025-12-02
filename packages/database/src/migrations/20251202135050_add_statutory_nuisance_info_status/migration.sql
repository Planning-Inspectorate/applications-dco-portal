BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [statutoryNuisanceInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_statutoryNuisanceInformationStatusId_df] DEFAULT 'not-started';

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_statutoryNuisanceInformationStatusId_fkey] FOREIGN KEY ([statutoryNuisanceInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
