/*
  Rename consultationReportStatusId to newspaperNoticesStatusId on Case table.
  SQL Server requires dropping the default constraint before renaming the column.
*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_consultationReportStatusId_fkey];

-- Drop the auto-generated default constraint before renaming
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_consultationReportStatusId_df];

-- Rename the column
EXEC sp_rename 'dbo.Case.consultationReportStatusId', 'newspaperNoticesStatusId', 'COLUMN';

-- Re-add the default constraint with the new name
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_newspaperNoticesStatusId_df] DEFAULT 'not-started' FOR [newspaperNoticesStatusId];

-- Re-add the foreign key with the new name
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_newspaperNoticesStatusId_fkey] FOREIGN KEY ([newspaperNoticesStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
