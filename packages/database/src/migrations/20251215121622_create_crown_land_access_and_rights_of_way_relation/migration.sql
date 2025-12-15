BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [crownLandAccessAndRightsOfWayPlansStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_crownLandAccessAndRightsOfWayPlansStatusId_df] DEFAULT 'not-started';

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_crownLandAccessAndRightsOfWayPlansStatusId_fkey] FOREIGN KEY ([crownLandAccessAndRightsOfWayPlansStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
