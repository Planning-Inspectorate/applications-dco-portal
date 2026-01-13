BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [pipelinesId] UNIQUEIDENTIFIER;

-- CreateTable
CREATE TABLE [dbo].[Pipelines] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Pipelines_id_df] DEFAULT newid(),
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [owner] NVARCHAR(1000) NOT NULL,
    [startPoint] NVARCHAR(1000) NOT NULL,
    [endPoint] NVARCHAR(1000) NOT NULL,
    [length] INT NOT NULL,
    [externalDiameter] INT NOT NULL,
    [conveyance] NVARCHAR(2000) NOT NULL,
    [landRightsCrossingConsents] BIT NOT NULL,
    [landRightsCrossingConsentsAgreement] NVARCHAR(2000),
    CONSTRAINT [Pipelines_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_pipelinesId_fkey] FOREIGN KEY ([pipelinesId]) REFERENCES [dbo].[Pipelines]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
