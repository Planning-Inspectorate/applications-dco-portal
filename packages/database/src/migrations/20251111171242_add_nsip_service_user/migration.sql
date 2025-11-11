BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[NsipServiceUser] (
    [id] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [modifiedAt] DATETIME2 NOT NULL,
    [serviceUserType] NVARCHAR(1000),
    CONSTRAINT [NsipServiceUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [NsipServiceUser_caseReference_email_key] UNIQUE NONCLUSTERED ([caseReference],[email])
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
