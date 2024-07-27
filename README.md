# Expense Manager Server

This repository contains the backend code for the Expense Manager application. The server is built with Node.js.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [HTTP Routes](#http-routes)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Features

- Create an user
- User authentication using magic link
- Create an expense
- Update an existing expense
- Delete an expense
- Get expenses
- Get expenses metrics

## Technologies Used

- **Node.js**
- **Docker**
- **PostgresSQL**
- **Prisma**
- **Fastify**
- **JWT**
- **Zod**
- **Resend**
- **React Email**
- **Vitest**

## HTTP Routes

### Users

- **POST /users**

  - Description: Register a new user.
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
    ```

- **GET /me**

  - Description: Get user profile
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Response:
    ```json
    {
      "user": {
        "email": "johndoe@example.com",
        "name": "John Doe"
      }
    }
    ```

### Authentication

- **POST /authenticate**

  - Description: Send to user an email to authenticate using a link.
  - Request Body:
    ```json
    {
      "email": "johndoe@example.com"
    }
    ```

- **GET /auth-links/authenticate**

  - Description: Authenticate user using a link
  - Response Header: Cookies contains "access_token"

### Expenses

- **POST /expenses**

  - Description: Create a new expense.
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Request Body:
    ```json
    {
      "description": "Description test",
      "category": "Category test",
      "payment": "Payment test",
      "price": 10,
      "createdAt": "2011-10-05T14:48:00.000Z"
    }
    ```

- **GET /expenses**

  - Description: Get all expenses for the authenticated user.
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Query:

    - pageIndex,
    - description,
    - category,
    - payment,
    - createdAt,

  - Response:
    ```json
    {
      "expenses": [
        {
          "description": "Description test",
          "category": "Category test",
          "payment": "Payment test",
          "price": 10,
          "createdAt": "2011-10-05T14:48:00.000Z"
        }
      ]
    }
    ```

- **PUT /expenses/:id**

  - Description: Update an expense by ID.
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Request Body:
    ```json
    {
      "description": "Update Description test",
      "category": "Update Category test",
      "payment": "Update Payment test",
      "price": 10,
      "createdAt": "2011-10-05T14:48:00.000Z"
    }
    ```

- **DELETE /expenses/:id**

  - Description: Delete an expense by ID.
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```

- **GET /expenses/total-amount**

  - Description: Get expenses total amount
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Response:
    ```json
    {
      "total-amount": 10
    }
    ```

- **GET /expenses/monthly-amount**

  - Description: Get expenses monthly amount
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Response:
    ```json
    {
      "currentMonthlyExpenseAmount": 10,
      "diffFromLastMonth": "100.00"
    }
    ```

- **GET /expenses/daily-amount**

  - Description: Get expenses monthly amount
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Response:
    ```json
    {
      "dailyExpenseAmount": 30,
      "diffFromYesterday": "100.00"
    }
    ```

- **GET /expenses/popular-categories**

  - Description: Get popular categories
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Response:
    ```json
    {
      "categories": [
        {
          "category": "Category 1",
          "amount": 1
        },
        {
          "category": "Category 2",
          "amount": 2
        }
      ]
    }
    ```

- **GET /expenses/daily-amount-period**

  - Description: Get daily amount in period
  - Headers:
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - Query:

    - from,
    - to,

  - Response:

    ```json
    {
      "expensesAmountInPeriod": [
        {
          "amount": 10,
          "date": "2011-10-05T14:48:00.000Z"
        },
        {
          "amount": 20,
          "date": "2011-10-06T14:48:00.000Z"
        }
      ]
    }
    ```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- docker

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/RickyHideyukiTakakura/expense-manager-server.git
   cd expense-manager-server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

   or

   ```sh
   yarn install
   ```

### Running the Application

To start the application locally, use the following command:

```sh
npm run dev
```

or

```sh
yarn run dev
```
