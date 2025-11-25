/*
  Warnings:

  - Made the column `addressId` on table `ContactDetails` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ContactDetails] ALTER COLUMN [addressId] UNIQUEIDENTIFIER NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
