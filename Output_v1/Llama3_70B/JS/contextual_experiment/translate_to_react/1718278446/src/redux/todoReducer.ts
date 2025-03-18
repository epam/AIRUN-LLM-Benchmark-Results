const initialState = [];

const todoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.todo];
    case 'REMOVE_TODO':
      return state.filter((todo: any) => todo.id !== action.id);
    case 'EDIT_TODO':
      return state.map((todo: any) => (todo.id === action.id ? { ...todo, title: action.title } : todo));
    case 'TOGGLE_TODO':
      return state.map((todo: any) => (todo.id === action.id ? { ...todo, completed: !todo.completed } : todo));
    default:
      return state;
  }
};

export default todoReducer;
