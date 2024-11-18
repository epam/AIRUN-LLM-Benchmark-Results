Your task is to create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library.

When generating the code, ensure to adhere to the instructions below:
- Describe the provided commands.
- Provide a package.json file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments within the code.

## Run 1:
### Answer:
To create a project configuration based on the Vite builder with support for React, Redux, React-Router, TypeScript, and testing library, follow these steps:

1. Create a new Vite project with React and TypeScript template:
```
npm create vite@latest my-react-app --template react-ts
```

2. Navigate to the project directory:
```
cd my-react-app
```

3. Install additional dependencies:
```
npm install react-redux @reduxjs/toolkit react-router-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

4. Install development dependencies:
```
npm install -D vitest jsdom @testing-library/jest-dom @types/react-redux
```

Here's the package.json file with the necessary configurations:

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.11.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@types/react-redux": "^7.1.25",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.38.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "jsdom": "^22.0.0",
    "typescript": "^5.0.2",
    "vite": "^4.3.2",
    "vitest": "^0.31.0"
  }
}
```

To set up Vitest for testing, create a `vitest.config.ts` file in the root of your project:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

Create a `src/setupTests.ts` file:

```typescript
import '@testing-library/jest-dom'
```

Now your project is configured with Vite, React, Redux, React-Router, TypeScript, and testing library support.

### Tokens: {'input_tokens': 140, 'output_tokens': 855}
### Execution time: 9.951313734054565
