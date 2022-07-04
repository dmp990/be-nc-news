# Northcoders News API

## Background

This project builds an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database is in PSQL, and will be interacted with using [node-postgres](https://node-postgres.com/).

## Set up the Project
The `db` folder contains all the data required for the project. We'll create two databases in this project. One for test data and one for real looking dev data. In order to connect to databases locally, you'll have to create two .env files: `.env.development` and `.env.test`. Into each file, add `PGDATABASE=<database_name>` where `database_name` is `nc_news` for `.env.development` file and `nc_news_test` for `.env.test` file. 