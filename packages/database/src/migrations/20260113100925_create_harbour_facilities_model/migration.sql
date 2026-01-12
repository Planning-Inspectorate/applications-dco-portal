BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [harbourFacilitiesId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[HarbourFacilities] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [HarbourFacilities_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [whyHarbourOrderNeeded] NVARCHAR(2000) NOT NULL,
    [benefitsToSeaTransport] NVARCHAR(2000) NOT NULL,
    CONSTRAINT [HarbourFacilities_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_harbourFacilitiesId_fkey] FOREIGN KEY ([harbourFacilitiesId]) REFERENCES [dbo].[HarbourFacilities]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
