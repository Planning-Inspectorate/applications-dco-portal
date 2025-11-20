BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[WhitelistUser] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [WhitelistUser_id_df] DEFAULT newid(),
    [caseReference] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [isInitialInvitee] BIT NOT NULL CONSTRAINT [WhitelistUser_isInitialInvitee_df] DEFAULT 0,
    [userRoleId] NVARCHAR(1000) NOT NULL,
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [WhitelistUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [WhitelistUser_caseReference_email_key] UNIQUE NONCLUSTERED ([caseReference],[email])
);

-- CreateTable
CREATE TABLE [dbo].[WhitelistUserRole] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000),
    CONSTRAINT [WhitelistUserRole_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[WhitelistUser] ADD CONSTRAINT [WhitelistUser_userRoleId_fkey] FOREIGN KEY ([userRoleId]) REFERENCES [dbo].[WhitelistUserRole]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[WhitelistUser] ADD CONSTRAINT [WhitelistUser_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
