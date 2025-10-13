BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Document_id_df] DEFAULT newid(),
    [fileName] NVARCHAR(1000) NOT NULL,
    [categoryId] NVARCHAR(1000) NOT NULL,
    [subCategoryId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentCategory] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000),
    CONSTRAINT [DocumentCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentSubCategory] (
    [id] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000),
    [categoryId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentSubCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[DocumentCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_subCategoryId_fkey] FOREIGN KEY ([subCategoryId]) REFERENCES [dbo].[DocumentSubCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentSubCategory] ADD CONSTRAINT [DocumentSubCategory_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[DocumentCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
