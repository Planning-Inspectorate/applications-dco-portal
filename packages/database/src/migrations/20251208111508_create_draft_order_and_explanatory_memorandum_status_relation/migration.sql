BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [draftOrderAndExplanatoryMemorandumStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_draftOrderAndExplanatoryMemorandumStatusId_df] DEFAULT 'not-started';

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_draftOrderAndExplanatoryMemorandumStatusId_fkey] FOREIGN KEY ([draftOrderAndExplanatoryMemorandumStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
