BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [natureConservationAndEnvironmentalInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_natureConservationAndEnvironmentalInformationStatusId_df] DEFAULT 'not-started';

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_natureConservationAndEnvironmentalInformationStatusId_fkey] FOREIGN KEY ([natureConservationAndEnvironmentalInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
