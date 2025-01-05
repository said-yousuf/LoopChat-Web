# Loop Chat - React + TypeScript + Vite with a NestJS Backend

**Loop Chat** is a lightweight and minimalistic chat application with a **React + TypeScript + Vite** frontend and a robust **NestJS** backend. While the app currently includes basic features, this setup is designed for scalability and ease of development.

## Features

### Frontend

- **React + Vite**: Fast and efficient development experience with Hot Module Replacement (HMR).
- **TypeScript**: Type safety for better maintainability.
- **Customizable ESLint Rules**: Maintain code quality and enforce consistency.

### Backend

- **NestJS Framework**: Scalable and modular backend architecture.
- **REST API Integration**: Seamless communication between the frontend and backend.
- **Extensible Design**: Easily add features as the app grows.

## Current Plugins

The frontend uses one of the following Vite plugins for enhanced React support:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) - Powered by [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) - Uses [SWC](https://swc.rs/) for faster builds.

## Setting Up the Project

### Frontend

1. **Clone the repository**:

   ```bash
   git clone <frontend-repo-url>
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Backend

1. **Clone the backend repository**:

   ```bash
   git clone <backend-repo-url>
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the backend server**:

   ```bash
   npm run start
   ```

4. **API Configuration**: Ensure the frontend `.env` file points to the backend API URL (e.g., `http://localhost:3000`).

## Expanding the ESLint Configuration

To maintain a scalable and clean codebase, enhance the ESLint setup as follows:

1. **Enable type-aware lint rules** in `eslint.config.js`:

   ```js
   export default tseslint.config({
     languageOptions: {
       parserOptions: {
         project: ["./tsconfig.node.json", "./tsconfig.app.json"],
         tsconfigRootDir: import.meta.dirname,
       },
     },
   });
   ```

2. **Install and configure React-specific linting**:

   ```bash
   npm install eslint-plugin-react --save-dev
   ```

   ```js
   // eslint.config.js
   import react from "eslint-plugin-react";

   export default tseslint.config({
     settings: { react: { version: "18.3" } },
     plugins: { react },
     rules: {
       ...react.configs.recommended.rules,
       ...react.configs["jsx-runtime"].rules,
     },
   });
   ```

## Future Development

- **Authentication**: Add user login and session management.
- **Real-Time Messaging**: Implement WebSocket support with NestJS for live chat.
- **Chat History**: Store and retrieve chat logs from the database.
- **UI Enhancements**: Improve the user interface and add responsive design.
- **File Sharing**: Enable users to share files and media in chat.
