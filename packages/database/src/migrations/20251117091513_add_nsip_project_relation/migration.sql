BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[NsipServiceUser] ADD [addressCountry] NVARCHAR(1000),
[addressCounty] NVARCHAR(1000),
[addressLine1] NVARCHAR(1000),
[addressLine2] NVARCHAR(1000),
[addressTown] NVARCHAR(1000),
[firstName] NVARCHAR(1000),
[lastName] NVARCHAR(1000),
[organisation] NVARCHAR(1000),
[postcode] NVARCHAR(1000),
[telephoneNumber] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[NsipProject] (
    [caseId] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    [projectName] NVARCHAR(1000),
    [projectDescription] NVARCHAR(1000),
    [projectLocation] NVARCHAR(1000),
    [easting] INT,
    [northing] INT,
    CONSTRAINT [NsipProject_pkey] PRIMARY KEY CLUSTERED ([caseId]),
    CONSTRAINT [NsipProject_caseReference_key] UNIQUE NONCLUSTERED ([caseReference])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
