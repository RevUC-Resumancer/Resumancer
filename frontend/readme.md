# React App Setup Guide

## Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm**: Comes pre-installed with Node.js. Check if installed by running `npm -v` in your terminal.
- **Code Editor**: A code editor like [Visual Studio Code](https://code.visualstudio.com/).

## Step 1: Setting up the React Application

1. **Create a new React app** using `create-react-app`:

   ```bash
   npx create-react-app my-app
   ```

2. **Navigate to the project directory**:

   ```bash
   cd my-app
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   Your React app should now be running at `http://localhost:3000/`.

## Step 2: Project Structure

```plaintext
my-app/
├── node_modules/          # Project dependencies
├── public/                # Public files
├── src/                   # Source files (React components)
│   ├── App.js             # Main App component
│   ├── index.js           # Entry point of the app
├── package.json           # Project configuration
└── .gitignore             # Git ignore file
```

## Step 3: Adding Components

1. **Create a new component** in `src/`:

   ```jsx
   import React from 'react';

   const MyComponent = () => {
     return <h1>Hello, World!</h1>;
   };

   export default MyComponent;
   ```

2. **Use the new component** in `src/App.js`:

   ```jsx
   import React from 'react';
   import MyComponent from './MyComponent';

   function App() {
     return (
       <div className="App">
         <MyComponent />
       </div>
     );
   }

   export default App;
   ```

## Step 4: Installing Additional Packages

To install additional packages, run:

```bash
npm install <package-name>
```

Example:

```bash
npm install react-router-dom
```

## Step 5: Running the Application

To run your application locally:

```bash
npm start
```

Your app will be available at `http://localhost:3000`.

## Step 6: Build for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `build/` folder for deployment.

## Common Commands

- `npm start`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm test`: Runs tests.
- `npm install`: Installs dependencies.
- `npm run eject`: Ejects the app from `create-react-app`.
