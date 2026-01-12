BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [highwayRelatedDevelopmentId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[HighwayRelatedDevelopment] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [HighwayRelatedDevelopment_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [groundLevels] NVARCHAR(1000) NOT NULL,
    [bridgeHeights] NVARCHAR(2000) NOT NULL,
    [tunnelDepths] NVARCHAR(2000) NOT NULL,
    [tidalWaterLevels] NVARCHAR(2000) NOT NULL,
    [heightOfStructures] NVARCHAR(2000) NOT NULL,
    [drainageOutfallDetails] NVARCHAR(2000) NOT NULL,
    CONSTRAINT [HighwayRelatedDevelopment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_highwayRelatedDevelopmentId_fkey] FOREIGN KEY ([highwayRelatedDevelopmentId]) REFERENCES [dbo].[HighwayRelatedDevelopment]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
