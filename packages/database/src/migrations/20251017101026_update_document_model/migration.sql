/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `apfpRegulationId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_categoryId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Document] DROP COLUMN [categoryId];
ALTER TABLE [dbo].[Document] ADD [apfpRegulationId] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_apfpRegulationId_fkey] FOREIGN KEY ([apfpRegulationId]) REFERENCES [dbo].[ApfpRegulation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
