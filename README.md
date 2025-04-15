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
DB_NAME=company_system
JWT_SECRET=any_key

PORT=3001

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=recuperar.ingesoft@gmail.com
SMTP_PASS=gmail_app_password
```

5. Run the server: `npm run dev`

## API Docs

### Headers

Some routes require authentication via a JWT token. For these routes, include the following header:

```
Authorization: Bearer <your_token>
```

---

## User

### POST | /user/register

**Body:**

```json
{
  "username": "string",
  "phone": "string",
  "mail": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "username": "string",
  "phone": "string",
  "mail": "string"
}
```

---

### POST | /user/login

**Body:**

```json
{
  "identifier": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "message": "string",
  "token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "phone": "string",
    "mail": "string"
  }
}
```

---

### POST | /user/request-password-change

**Body:**

```json
{
  "mail": "string"
}
```

**Response:**

```json
{
  "message": "A verification code has been sent to your email"
}
```

---

### POST | /user/change-password

**Body:**

```json
{
  "mail": "string",
  "verificationCode": "string",
  "newPassword": "string"
}
```

**Response:**

```json
{
  "message": "Password updated successfully"
}
```

---

### GET | /user/get-all

**Response:**

```json
[
  {
    "username": "string",
    "phone": "string",
    "mail": "string"
  }
]
```

---

## Company

### POST | /company/post

**Headers:**

```
Authorization: Bearer <your_token>
```

**Body:**

```json
{
  "name": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "name": "string",
  "user_id": "number"
}
```

---

### GET | /company/get-all

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "id": "number",
    "name": "string",
    "user_id": "number"
  }
]
```

---

## Supplier

### POST | /supplier/post/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Body:**

```json
{
  "code": "string",
  "name": "string",
  "country": "string",
  "address": {
    "town": "string",
    "street": "string",
    "number": "number",
    "floor": "number",
    "departament": "string",
    "zip_code": "string",
    "observations": "string"
  },
  "phone": "string",
  "mail": "string",
  "web": "string",
  "description": "string",
  "CUIT": "string",
  "CUIL": "string",
  "DNI": "string",
  "CDI": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "code": "string",
  "name": "string",
  "country": "string",
  "address": {
    "town": "string",
    "street": "string",
    "number": "number",
    "floor": "number",
    "departament": "string",
    "zip_code": "string",
    "observations": "string"
  },
  "phone": "string",
  "mail": "string",
  "web": "string",
  "description": "string",
  "CUIT": "string",
  "CUIL": "string",
  "DNI": "string",
  "CDI": "string",
  "company_id": "number"
}
```

### GET | /supplier/get-all/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "id": "number",
    "code": "string",
    "name": "string",
    "country": "string",
    "address": {
      "town": "string",
      "street": "string",
      "number": "number",
      "floor": "number",
      "departament": "string",
      "zip_code": "string",
      "observations": "string"
    },
    "phone": "string",
    "mail": "string",
    "web": "string",
    "description": "string",
    "CUIT": "string",
    "CUIL": "string",
    "DNI": "string",
    "CDI": "string",
    "company_id": "number"
  }
]
```

---

### DELETE | /supplier/delete/:companyId/:supplierId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
{
  "message": "Supplier deleted successfully",
  "id": "number"
}
```

---

## Product

### POST | /product/post/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Body:**

```json
{
  "sku": "string",
  "upc": "string",
  "ean": "string",
  "name": "string",
  "list_price": "number",
  "currency": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "sku": "string",
  "upc": "string",
  "ean": "string",
  "name": "string",
  "list_price": "number",
  "currency": "string",
  "company_id": "number"
}
```

---

### GET | /product/get-all/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "id": "number",
    "sku": "string",
    "upc": "string",
    "ean": "string",
    "name": "string",
    "list_price": "number",
    "currency": "string",
    "company_id": "number"
  }
]
```

---

## Purchase

### POST | /purchase/post/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Body:**

```json
{
  "condition": "string",
  "supplier_id": "number",
  "proof_code": "string",
  "proof_type": "string",
  "products_details": [
    {
      "batch_number": "string",
      "quantity": "number",
      "unit_price": "number",
      "product_id": "number"
    }
  ]
}
```

**Response:**

```json
{
  "id": "number",
  "condition": "string",
  "supplier_id": "number",
  "company_id": "number"
}
```

---

### GET | /purchase/get-all/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "id": "number",
    "created_at": "string",
    "condition": "string",
    "company_id": "number",
    "total": "number",
    "canceled": "number",
    "proof": {
      "id": "number",
      "supplier_id": "number",
      "code": "string",
      "type": "string",
      "order_id": "number"
    },
    "details": [
      {
        "id": "number",
        "batch_number": "string",
        "quantity": "number",
        "unit_price": "number",
        "total": "number",
        "canceled": "boolean",
        "product_id": "number"
      }
    ]
  }
]
```

---

## Sale

### POST | /sale/post/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Body:**

```json
{
  "condition": "string",
  "client_id": "number",
  "proof_code": "string",
  "proof_type": "string",
  "products_details": [
    {
      "batch_number": "string",
      "total": "number",
      "product_id": "number"
    }
  ]
}
```

**Response:**

```json
{
  "id": "number",
  "condition": "string",
  "client_id": "number",
  "company_id": "number"
}
```

---

### GET | /sale/get-all/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "id": "number",
    "created_at": "string",
    "condition": "string",
    "company_id": "number",
    "total": "number",
    "canceled": "number",
    "proof": {
      "id": "number",
      "client_id": "number",
      "code": "string",
      "type": "string",
      "order_id": "number"
    },
    "details": [
      {
        "id": "number",
        "batch_number": "string",
        "total": "number",
        "canceled": "boolean",
        "product_id": "number"
      }
    ]
  }
]
```

---

## Client

### POST | /client/post/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Body:**

```json
{
  "code": "string",
  "name": "string",
  "country": "string",
  "address": {
    "town": "string",
    "street": "string",
    "number": "number",
    "floor": "number",
    "departament": "string",
    "zip_code": "string",
    "observations": "string"
  },
  "phone": "string",
  "mail": "string",
  "web": "string",
  "description": "string",
  "CUIT": "string",
  "CUIL": "string",
  "DNI": "string",
  "CDI": "string"
}
```

**Response:**

```json
{
  "id": "number",
  "code": "string",
  "name": "string",
  "country": "string",
  "address": {
    "town": "string",
    "street": "string",
    "number": "number",
    "floor": "number",
    "departament": "string",
    "zip_code": "string",
    "observations": "string"
  },
  "phone": "string",
  "mail": "string",
  "web": "string",
  "description": "string",
  "CUIT": "string",
  "CUIL": "string",
  "DNI": "string",
  "CDI": "string",
  "company_id": "number"
}
```

---

### GET | /client/get-all/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "id": "number",
    "code": "string",
    "name": "string",
    "country": "string",
    "address": {
      "town": "string",
      "street": "string",
      "number": "number",
      "floor": "number",
      "departament": "string",
      "zip_code": "string",
      "observations": "string"
    },
    "phone": "string",
    "mail": "string",
    "web": "string",
    "description": "string",
    "CUIT": "string",
    "CUIL": "string",
    "DNI": "string",
    "CDI": "string",
    "company_id": "number"
  }
]
```

---

## Inventory

### GET | /inventory/get-all/:companyId

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
[
  {
    "product": {
      "id": "number",
      "sku": "string",
      "upc": "string",
      "ean": "string",
      "name": "string",
      "list_price": "number",
      "currency": "string",
      "company_id": "number"
    },
    "total_spent": "number",
    "amount": "number"
  }
]
```
```