import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { TodoApp } from "./features/todos/TodoApp";

const container = document.getElementsByClassName("todoapp")[0];
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>
);
