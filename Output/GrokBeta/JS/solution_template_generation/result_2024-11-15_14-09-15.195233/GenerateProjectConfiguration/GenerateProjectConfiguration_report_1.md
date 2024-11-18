Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
Here's how we'll approach this task:

1. **Initialize a Vite Project**: We'll start by setting up a new Vite project with React and TypeScript.

2. **Add Dependencies**: We'll include necessary packages for React, Redux, React-Router, and testing.

3. **Configure Vite**: We'll adjust the Vite configuration to support TypeScript and other tools.

4. **Setup Testing Environment**: Configure Jest and React Testing Library for unit testing.

5. **Create `package.json`**: This will include all scripts, dependencies, and configurations.

### Commands Description:

- **npm init vite@latest**: Initializes a new Vite project with the latest version, selecting React with TypeScript.
- **npm install**: Installs all dependencies listed in `package.json`.
- **npm run dev**: Starts the development server with Vite.
- **npm run build**: Builds the project for production.
- **npm run test**: Runs the tests using Jest.
- **npm run lint**: Lints the code using ESLint.

### package.json:

```json
{
  "name": "vite-react-redux-router-ts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "redux": "^4.2.0",
    "@reduxjs/toolkit": "^1.8.5"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^27.5.1",
    "@types/react": "^18.0.15",
    "@types/react-dom": "^18.0.6",
    "@types/react-redux": "^7.1.24",
    "@types/react-router-dom": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^5.30.5",
    "@typescript-eslint/parser": "^5.30.5",
    "@vitejs/plugin-react": "^2.0.0",
    "eslint": "^8.19.0",
    "eslint-plugin-react": "^7.30.1",
    "jest": "^28.1.1",
    "jest-environment-jsdom": "^28.1.1",
    "ts-jest": "^28.0.5",
    "typescript": "^4.7.4",
    "vite": "^3.0.0"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
      "<rootDir>/src/setupTests.ts"
    ]
  }
}
```

This `package.json` file includes:

- **Scripts**: Commands for development, building, testing, and linting.
- **Dependencies**: Core libraries needed for the project.
- **DevDependencies**: Development tools and type definitions.
- **Jest Configuration**: Setup for Jest to work with TypeScript and React. 

Remember to create a `src/setupTests.ts` file for any setup code needed for your tests.

### Tokens: {'input_tokens': 128, 'output_tokens': 774}
### Execution time: 15.295543909072876
