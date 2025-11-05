BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [aboutTheProjectStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_aboutTheProjectStatusId_df] DEFAULT 'not-started',
[applicantAndAgentDetailsStatusId] NVARCHAR(1000) NOT NULL CONSTRAINT [Case_applicantAndAgentDetailsStatusId_df] DEFAULT 'not-started';

-- CreateTable
CREATE TABLE [dbo].[PaymentMethod] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PaymentMethod_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ContactDetails] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [ContactDetails_id_df] DEFAULT newid(),
    [organisation] NVARCHAR(1000) NOT NULL,
    [paymentMethodId] NVARCHAR(1000) NOT NULL,
    [paymentReference] NVARCHAR(1000) NOT NULL,
    [caseId] UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [ContactDetails_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ContactDetails_caseId_key] UNIQUE NONCLUSTERED ([caseId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicantAndAgentDetailsStatusId_fkey] FOREIGN KEY ([applicantAndAgentDetailsStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_aboutTheProjectStatusId_fkey] FOREIGN KEY ([aboutTheProjectStatusId]) REFERENCES [dbo].[DocumentCategoryStatus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContactDetails] ADD CONSTRAINT [ContactDetails_paymentMethodId_fkey] FOREIGN KEY ([paymentMethodId]) REFERENCES [dbo].[PaymentMethod]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContactDetails] ADD CONSTRAINT [ContactDetails_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
