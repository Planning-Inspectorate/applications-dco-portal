BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [scanResultId] NVARCHAR(1000) NOT NULL CONSTRAINT [Document_scanResultId_df] DEFAULT 'pending';

-- CreateTable
CREATE TABLE [dbo].[DocumentScanResult] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000),
    CONSTRAINT [DocumentScanResult_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_scanResultId_fkey] FOREIGN KEY ([scanResultId]) REFERENCES [dbo].[DocumentScanResult]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
