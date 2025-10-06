BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[OneTimePassword] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [hashed_otp_code] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OneTimePassword_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [expiresAt] DATETIME2 NOT NULL,
    [attempts] INT NOT NULL CONSTRAINT [OneTimePassword_attempts_df] DEFAULT 0,
    CONSTRAINT [OneTimePassword_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [OneTimePassword_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [OneTimePassword_email_idx] ON [dbo].[OneTimePassword]([email]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
