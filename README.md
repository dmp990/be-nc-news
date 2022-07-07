# News API

## Background

This project builds a REST API for the purpose of accessing application data programmatically.

The database is in PSQL, and will be interacted with using [node-postgres](https://node-postgres.com/).

### Heroku Link: https://asads-news-server.herokuapp.com/api

# Get Started

## Clone this Repo

To be able to run this project locally, please clone this repository down to your machine.

To do so, open your terminal and run

`git clone https://github.com/dmp990/be-nc-news.git`.

Then `cd` into the directory:

`cd be-nc-news`

## Install Dependencies

This project was built using Node v18.3.0 and depends on following packages:

- express v4.18.1
- pg v8.7.3
- pg-format v1.0.4
- dotenv v16.0.0

To install all the dependencies, open your terminal and run:

`npm i`

## Seed Local Databases

The `db` folder contains all the data required for the project. We'll create two databases in this project. One for test data and one for real looking dev data. In order to connect to databases locally, you'll have to create two .env files: `.env.development` and `.env.test`.

Into each file, add `PGDATABASE=<database_name>` where `database_name` is `nc_news` for `.env.development` file and `nc_news_test` for `.env.test` file.

Please note that if you do not wish to run the test files, you do not need to create `.env.test` file. Moreover, if you are not on macOS add the following line to each `.env` file

`PASSWORD=<your-psql-password>`

> **_IMPORTANT:_** Do not forget to add your `.env` files to `.gitignore`.

After that, run the following commands in order:

`npm run setup-dbs` : which will create two new databases `nc_news` and `nc_news_test`.

`npm run seed` : which will seed both the databases with initial data.

## Run the Server

You can run the server by running:

`npm start`

## Run Tests

To run tests, you will have to install `jest` and `supertest` as developer dependencies. To do this, run the following commands:

`npm i -D jest`

`npm i -D supertest`

All the test files can be found in `__tests__` folder. To run the tests, simply run:

`npm t <test-file-name>`

> **_NOTE:_** Omit the `<test-file-name>` if you want to run all the tests.
