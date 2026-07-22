BEGIN TRY

BEGIN TRAN;

IF NOT EXISTS (
    SELECT *
    FROM dbo.DocumentCategory
    WHERE id = 'newspaper-notices'
)
BEGIN
INSERT INTO dbo.DocumentCategory (
    id,
    displayName
)
VALUES (
           'newspaper-notices',
           'Newspaper notices'
       );
END;

IF NOT EXISTS (
    SELECT *
    FROM dbo.DocumentSubCategory
    WHERE id = 'newspaper-notices'
)
BEGIN
INSERT INTO dbo.DocumentSubCategory (
    id,
    displayName,
    categoryId
)
VALUES (
           'newspaper-notices',
           'Newspaper notices',
           'newspaper-notices'
       );
END;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
ROLLBACK TRAN;
END;

THROW;

END CATCH;