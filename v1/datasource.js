const { DataSource } = require("typeorm")

const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "medusa-z0g5",
  entities: [
  ],
  migrations: [
    "dist/migrations/*.js",
  ],
  autoLoadEntities: true
})

module.exports = {
  datasource: AppDataSource,
}