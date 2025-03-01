# React App Setup Guide

## Prerequisites

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm**: Comes pre-installed with Node.js. Check if installed by running `npm -v` in your terminal.
- **Code Editor**: A code editor like [Visual Studio Code](https://code.visualstudio.com/).

# Setup and Run the Project (after cloning the repo)
1. **Navigate to the project directory**:

   ```bash
   cd front-end
   ```

2. **Install dependencies locally**:

   ```bash
   npm install package.json
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   Your React app should now be running in a localhost network environment.


## Installing Additional Packages

To install additional packages, run:

```bash
npm install <package-name>
```

Example:

```bash
npm install react-router-dom
```

This will generate a `build/` folder for deployment.

## Common Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm test`: Runs tests.
- `npm install`: Installs dependencies.
- `npm run eject`: Ejects the app from `create-react-app`.
