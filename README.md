# book-share-api
code test

## Installation
Clone the repository or download it and open the folder in Terminal

Use the package manager [npm](https://www.npmjs.com/) to install neccessary packages.

```bash
npm install
```

## Environment Variable

Set to production when deploying to production:
```bash
NODE_ENV=development
```

Node.js server configuration:
```bash
PORT=8080
```

Database configuration:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=book_share_db
DB_USERNAME=root
DB_PASSWORD=root
DB_TIMEZONE=+00:00
```
Secret Key for JWT:
```bash
ADMIN_SECRET_KEY=YOUR_SECRET_KEY
```

## Getting started

Development:
```bash
npm run start:dev
```

After start the server, sequelize automitically synce all tables.




