BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [offshoreGeneratingStationId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[OffshoreGeneratingStation] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [OffshoreGeneratingStation_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [cableInstallation] NVARCHAR(2000) NOT NULL,
    [safetyZones] NVARCHAR(2000) NOT NULL,
    CONSTRAINT [OffshoreGeneratingStation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_offshoreGeneratingStationId_fkey] FOREIGN KEY ([offshoreGeneratingStationId]) REFERENCES [dbo].[OffshoreGeneratingStation]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
