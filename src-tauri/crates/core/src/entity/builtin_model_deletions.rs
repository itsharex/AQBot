use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "builtin_model_deletions")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub builtin_id: String,
    #[sea_orm(primary_key, auto_increment = false)]
    pub model_id: String,
    pub deleted_at: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
