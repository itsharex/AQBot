use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(BuiltinModelDeletions::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(BuiltinModelDeletions::BuiltinId)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(BuiltinModelDeletions::ModelId)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(BuiltinModelDeletions::DeletedAt)
                            .integer()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(BuiltinModelDeletions::BuiltinId)
                            .col(BuiltinModelDeletions::ModelId),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(
                Table::drop()
                    .table(BuiltinModelDeletions::Table)
                    .if_exists()
                    .to_owned(),
            )
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum BuiltinModelDeletions {
    Table,
    BuiltinId,
    ModelId,
    DeletedAt,
}
