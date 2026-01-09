BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [nonOffshoreGeneratingStationId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[NonOffshoreGeneratingStation] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [NonOffshoreGeneratingStation_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [electricityGrid] NVARCHAR(2000) NOT NULL,
    [gasFuelledGeneratingStation] BIT NOT NULL,
    [gasPipelineConnection] NVARCHAR(2000) NOT NULL,
    CONSTRAINT [NonOffshoreGeneratingStation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_nonOffshoreGeneratingStationId_fkey] FOREIGN KEY ([nonOffshoreGeneratingStationId]) REFERENCES [dbo].[NonOffshoreGeneratingStation]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
