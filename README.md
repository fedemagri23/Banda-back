# Nodejs PostgreSQL REST API

A REST API using Node.js and PostgreSQL with pg library and using Express.js for routing.

## Requirements

- Node.js

- PostgreSQL

## Installation

1. Install the dependencies: `npm install`

2. Create a database in PostgreSQL, named company_system

3. Copy db.sql elements into the database console and run to save changes

4. Create a .env file in the root directory and add the following:

```
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=your_port
DB_DATABASE=company_system

PORT=3001
```

5. Run the server: `npm run dev`