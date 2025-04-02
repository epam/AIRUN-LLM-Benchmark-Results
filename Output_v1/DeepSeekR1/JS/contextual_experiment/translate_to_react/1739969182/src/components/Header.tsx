import { useState } from 'react';

type HeaderProps = {
  onNewTodo: (title: string) => void;
};

export default function Header({ onNewTodo }: HeaderProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodoTitle.trim();
    if (title) {
      onNewTodo(title);
      setNewTodoTitle('');
    }
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
}
