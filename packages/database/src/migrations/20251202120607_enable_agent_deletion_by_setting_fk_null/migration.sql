BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_agentDetailsId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Case] DROP CONSTRAINT [Case_applicantDetailsId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_applicantDetailsId_fkey] FOREIGN KEY ([applicantDetailsId]) REFERENCES [dbo].[ContactDetails]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_agentDetailsId_fkey] FOREIGN KEY ([agentDetailsId]) REFERENCES [dbo].[ContactDetails]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
