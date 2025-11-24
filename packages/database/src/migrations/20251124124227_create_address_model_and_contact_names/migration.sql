/*
  Warnings:

  - Added the required column `addressId` to the `ContactDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailAddress` to the `ContactDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `ContactDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `ContactDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `ContactDetails` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ContactDetails] ADD [addressId] UNIQUEIDENTIFIER,
[emailAddress] NVARCHAR(1000) NOT NULL,
[fax] NVARCHAR(1000),
[firstName] NVARCHAR(1000) NOT NULL,
[lastName] NVARCHAR(1000) NOT NULL,
[phone] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[FullAddress] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [FullAddress_id_df] DEFAULT newid(),
    [addressLine1] NVARCHAR(1000) NOT NULL,
    [addressLine2] NVARCHAR(1000) NOT NULL,
    [townCity] NVARCHAR(1000) NOT NULL,
    [county] NVARCHAR(1000),
    [country] NVARCHAR(1000) NOT NULL,
    [postcode] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [FullAddress_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ContactDetails] ADD CONSTRAINT [ContactDetails_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[FullAddress]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
