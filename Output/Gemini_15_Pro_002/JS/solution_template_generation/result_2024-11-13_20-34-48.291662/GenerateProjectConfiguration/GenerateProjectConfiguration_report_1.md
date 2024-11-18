Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
```bash
npm create vite@latest my-react-app --template react-ts
cd my-react-app
npm install react-router-dom @reduxjs/toolkit react-redux
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest ts-jest
npm install --save-dev @types/react-router-dom @types/jest
```

**Commands Description:**

1. **`npm create vite@latest my-react-app --template react-ts`**: This command uses the `create-vite` tool to scaffold a new Vite project.  `@latest` ensures you're using the latest version of Vite. `my-react-app` is the name of the project directory (you can choose any valid directory name). `--template react-ts` specifies that you want a React project with TypeScript support.

2. **`cd my-react-app`**: This command navigates into the newly created project directory.

3. **`npm install react-router-dom @reduxjs/toolkit react-redux`**: This installs the necessary packages for routing (react-router-dom), state management (Redux Toolkit), and connecting Redux to React components (react-redux).

4. **`npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest ts-jest`**: This installs the required testing libraries as development dependencies. `@testing-library/react` is the core testing library. `@testing-library/jest-dom` provides custom matchers for Jest. `@testing-library/user-event` allows for more realistic user interaction simulations. `jest` is the test runner, and `ts-jest` allows Jest to work with TypeScript.

5. **`npm install --save-dev @types/react-router-dom @types/jest`**: This installs the TypeScript type definitions for react-router-dom and jest. These are necessary for proper type checking in your tests and application code.


```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.5.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react": "^4.0.3",
    "jest": "^29.6.2",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```


### Tokens: {'input_tokens': 126, 'output_tokens': 820}
### Execution time: 18.335742950439453
