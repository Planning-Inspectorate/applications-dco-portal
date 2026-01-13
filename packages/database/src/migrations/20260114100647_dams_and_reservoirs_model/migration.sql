BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [damOrReservoirId] UNIQUEIDENTIFIER;

-- AlterTable
ALTER TABLE [dbo].[NonOffshoreGeneratingStation] ALTER COLUMN [gasPipelineConnection] NVARCHAR(2000) NULL;

-- CreateTable
CREATE TABLE [dbo].[DamOrReservoir] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [DamOrReservoir_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [recreationalAmenities] BIT NOT NULL,
    [recreationalAmenitiesDescription] NVARCHAR(2000),
    CONSTRAINT [DamOrReservoir_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_damOrReservoirId_fkey] FOREIGN KEY ([damOrReservoirId]) REFERENCES [dbo].[DamOrReservoir]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
