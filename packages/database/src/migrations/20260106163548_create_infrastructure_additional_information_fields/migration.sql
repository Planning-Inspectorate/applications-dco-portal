BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [infrastructureAdditionalInformationDescription] NVARCHAR(2000),
[infrastructureSpecificAdditionalInformationStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_infrastructureSpecificAdditionalInformationStatusId_df] DEFAULT 'not-started';

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_infrastructureSpecificAdditionalInformationStatusId_fkey] FOREIGN KEY ([infrastructureSpecificAdditionalInformationStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
