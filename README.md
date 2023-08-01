# DiMOS

## A digital menu ordering system created for small businesses

### Getting Started

The application requires [Node.js](https://nodejs.org/) v16.17.0

Installing
```sh
cd <project_name>
npm install
```
Create a config.env file in the main directory with the following variables:
```sh
PORT=3300
MONGO_URI="your mongodb url"
DB_NAME=dimos
SESSION_SECRET="your secret"
ADMIN_EMAIL=admin@admin.com
```
Running the tests
```sh
npm test
```

Running the dev mode
```sh
npm run dev
```
Use
```sh
npm start
Navigate to http://localhost:3000/
```
Author

Simone Susino
