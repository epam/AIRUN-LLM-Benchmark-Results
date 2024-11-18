Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
```
npm create vite@latest my-react-app --template react-ts
cd my-react-app
```

This will create a React project with TypeScript and Vite.

```
npm install redux react-redux @types/react-redux react-router-dom @types/react-router-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

This will install Redux, React Router, and testing libraries.

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
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
    "@testing-library/jest-dom": "^6.1.3",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/react-router-dom": "^5.3.3",
    "@vitejs/plugin-react": "^4.0.3",
    "jsdom": "^22.1.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}

```

This is a `package.json` file with the dependencies and scripts.


### Tokens: {'input_tokens': 124, 'output_tokens': 468}
### Execution time: 10.947958946228027
