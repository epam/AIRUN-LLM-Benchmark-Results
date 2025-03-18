Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 4:
### Answer:
### Commands

- `npm create vite@latest my-react-app --template react-ts`
- `cd my-react-app`
- `npm install redux react-redux react-router-dom @testing-library/react @testing-library/jest-dom`

### package.json

```json
{
  "name": "my-react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.4.3",
    "redux": "^4.2.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^2.0.0",
    "typescript": "^4.9.4",
    "vite": "^3.2.4"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest"
  }
}
```
### Tokens: {'prompt_tokens': 125, 'completion_tokens': 305, 'total_tokens': 430}
### Execution time: 2.9665651321411133
