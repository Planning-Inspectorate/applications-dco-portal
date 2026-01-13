BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [hazardousWasteFacilityId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[HazardousWasteFacility] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [HazardousWasteFacility_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [whyIsFacilityNeeded] NVARCHAR(2000) NOT NULL,
    [annualCapacity] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [HazardousWasteFacility_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_hazardousWasteFacilityId_fkey] FOREIGN KEY ([hazardousWasteFacilityId]) REFERENCES [dbo].[HazardousWasteFacility]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
