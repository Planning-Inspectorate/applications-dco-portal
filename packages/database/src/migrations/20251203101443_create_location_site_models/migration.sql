BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [linearSiteId] UNIQUEIDENTIFIER,
[locationDescription] NVARCHAR(2000),
[singleSiteId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[SingleSite] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [SingleSite_id_df] DEFAULT newid(),
    [easting] INT NOT NULL,
    [northing] INT NOT NULL,
    CONSTRAINT [SingleSite_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LinearSite] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [LinearSite_id_df] DEFAULT newid(),
    [startEasting] INT NOT NULL,
    [startNorthing] INT NOT NULL,
    [middleEasting] INT NOT NULL,
    [middleNorthing] INT NOT NULL,
    [endEasting] INT NOT NULL,
    [endNorthing] INT NOT NULL,
    CONSTRAINT [LinearSite_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_singleSiteId_fkey] FOREIGN KEY ([singleSiteId]) REFERENCES [dbo].[SingleSite]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_linearSiteId_fkey] FOREIGN KEY ([linearSiteId]) REFERENCES [dbo].[LinearSite]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
