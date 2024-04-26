# Chat Application

- Technical assignment project
- It's a monorepo that contains both frontend and backend projects

## Start project development server

1. Install `node.js`. I use node version `(20.10.0)`.

2. Add a `.env` file to the root of the project (same folder as `.env.example` )

3. Install packages and generate Prisma model: Open terminal and run

    ```bash
    npm run dev:init
    ```

4. Start the backend server: Open terminal and run

    ```bash
    npm run dev:backend
    ```

   You can test it by using `http://localhost:6789/test`. If the server is working, it will return "hello world".

5. Start the frontend server: Open another terminal and run

    ```bash
    npm run dev:frontend
    ```

   You can access the website by clicking the link in the terminal or going to `http://localhost:5432`.

   NOTE: If you want to test with many users, change the `HOST` env from localhost to your IP address.

## Test Instruction

- I have created users for testing that use the pattern `a-z * 4 + '@example.com'` as a name. Here are examples:

```bash
aaaa@example.com
bbbb@example.com
cccc@example.com
dddd@example.com
.
.
.
zzz@example.com
```

- All users can access using the password `123456`.

- For example, if you use the email `dddd@example.com`, your name in the application will be `Dmockname`.

- After logging in, you need to add friends by searching for their name/email and adding them as friends. Then you will be able to chat with them.

## Tech stack and Main library

### Frontend

- ViteJS + React + TypeScript (client-side rendering)
- react-router-dom
- tailwindcss
- socket.io/clients

### Backend

- Express + TypeScript
- Database: __MongoDB__
- Prisma
- socket.io

## Main Folder Structure

### Frontend

- `components`: base/reusable components
- `core`: core modules (e.g., authentication)
- `page`: page components related to `Router.tsx`
- `service`: all functions that connect with services. If a service has changed, just configure it here.

#### Component Structure

If it has complex logic, I separate all the logic of each component into `controller.ts` located beside `index.tsx`, which contains the display part of the components (tsx). If a component has sub-components, I create a `components` folder and keep them inside.

```plaintext
Login
  |- components
      |- ...
  |- index.tsx
  |- controller.tsx
```

### Backend

- `controller`: all core logic, separated by the main route
- `controller/websocket`: keeps all websocket listeners
- `middleware`: all middleware (e.g., connect websocket/authorize)

I use MVC architecture, but as a role model, it may not 100% look like any MVC.
