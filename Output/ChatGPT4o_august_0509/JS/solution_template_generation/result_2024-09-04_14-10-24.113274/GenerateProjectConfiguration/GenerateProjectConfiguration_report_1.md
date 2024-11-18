Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
```json
{
  "name": "vite-react-redux-router-ts",
  "version": "1.0.0",
  "description": "A Vite project configured with React, Redux, React-Router, TypeScript, and testing library.",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.4.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.2.3",
    "@types/react": "^18.0.25",
    "@types/react-dom": "^18.0.9",
    "@vitejs/plugin-react": "^3.0.0",
    "eslint": "^8.27.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-react": "^7.31.10",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^2.7.1",
    "typescript": "^4.8.4",
    "vite": "^4.0.0",
    "vitest": "^0.25.3"
  }
}
```

### Commands Description:
- **dev**: Starts the Vite development server.
- **build**: Builds the project for production.
- **serve**: Serves the production build locally.
- **test**: Runs the tests using Vitest.
- **lint**: Runs ESLint to check for code quality issues.
- **format**: Formats the code using Prettier.

### Tokens: {'input_tokens': 132, 'output_tokens': 469}
### Execution time: 5.52355694770813
