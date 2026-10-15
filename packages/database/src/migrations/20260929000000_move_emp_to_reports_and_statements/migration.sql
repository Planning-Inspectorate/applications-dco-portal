BEGIN TRY

BEGIN TRAN;

UPDATE dbo.DocumentSubCategory
SET categoryId = 'reports-and-statements'
WHERE id = 'environmental-management-plan'
  AND categoryId <> 'reports-and-statements';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
ROLLBACK TRAN;
END;

THROW;

END CATCH;