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
  "description": "A Vite project with React, Redux, React-Router, TypeScript, and testing library support.",
  "main": "index.tsx",
  "scripts": {
    "dev": "vite", // Starts the development server
    "build": "vite build", // Builds the project for production
    "preview": "vite preview", // Previews the production build
    "test": "vitest", // Runs unit tests
    "test:watch": "vitest --watch", // Runs unit tests in watch mode
    "lint": "eslint . --ext .ts,.tsx", // Lints the codebase
    "format": "prettier --write ." // Formats the codebase
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.0",
    "react-router-dom": "^6.16.0",
    "redux": "^4.2.1",
    "redux-thunk": "^2.4.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.2.0",
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.2",
    "vite": "^4.4.0",
    "vitest": "^0.34.0"
  },
  "eslintConfig": {
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["react", "react-hooks"],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "rules": {
      "react/react-in-jsx-scope": "off"
    }
  },
  "prettier": {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5"
  },
  "type": "module"
}
```

### Tokens: {'input_tokens': 132, 'output_tokens': 609, 'reasoning_tokens': 0}
### Execution time: 4.842983961105347
