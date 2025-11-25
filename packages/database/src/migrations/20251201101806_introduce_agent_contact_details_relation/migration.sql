/*
  Warnings:

  - You are about to drop the column `paymentMethodId` on the `ContactDetails` table. All the data in the column will be lost.
  - You are about to drop the column `paymentReference` on the `ContactDetails` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ContactDetails] DROP CONSTRAINT [ContactDetails_addressId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ContactDetails] DROP CONSTRAINT [ContactDetails_paymentMethodId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [agentDetailsId] UNIQUEIDENTIFIER,
[paymentMethodId] NVARCHAR(1000),
[paymentReference] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[ContactDetails] DROP COLUMN [paymentMethodId],
[paymentReference];

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_agentDetailsId_fkey] FOREIGN KEY ([agentDetailsId]) REFERENCES [dbo].[ContactDetails]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_paymentMethodId_fkey] FOREIGN KEY ([paymentMethodId]) REFERENCES [dbo].[PaymentMethod]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ContactDetails] ADD CONSTRAINT [ContactDetails_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[FullAddress]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
