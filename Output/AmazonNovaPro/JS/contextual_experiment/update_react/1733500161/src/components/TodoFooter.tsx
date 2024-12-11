import React from 'react';\nimport { useSelector, useDispatch } from 'react-redux';\nimport { RootState } from '../store/store';\nimport { clearCompleted } from '../store/todoSlice';\nimport { Todo } from '../models/todoModel';\n\ninterface TodoFooterProps {}\n\nexport const TodoFooter: React.FC<TodoFooterProps> = () => {\n  const dispatch = useDispatch();\n  const todos = useSelector((state: RootState) => state.todos.todos);\n  const filter = useSelector((state: RootState) => state.todos.filter);
  const activeTodoCount = todos.reduce((accum, todo) => todo.completed ? accum : accum + 1, 0);
  const completedCount = todos.length - activeTodoCount;\n\n  const handleClearCompleted = () => {\n    dispatch(clearCompleted());\n  };\n\n  return (\n    <footer className="footer">\n      {activeTodoCount > 0 && (\n        <span className="todo-count">\n          <strong>{activeTodoCount}</strong> item{activeTodoCount !== 1 ? 's' : ''} left\n        </span>\n      )}\n      <ul className="filters">\n        {[ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS].map((status) => (\n          <li key={status}>\n            <a\n              href={`#/${status === ALL_TODOS ? '' : status}`}\n              className={status === filter ? 'selected' : ''}\n            >\n              {status.charAt(0).toUpperCase() + status.slice(1)}\n            </a>\n          </li>\n        ))}\n      </ul>\n      {completedCount > 0 && (\n        <button className="clear-completed" onClick={handleClearCompleted}>\n          Clear completed\n        </button>\n      )}\n    </footer>\n  );\n};