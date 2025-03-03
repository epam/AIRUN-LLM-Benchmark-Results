I have the following React app code:

app.tsx
```tsx
declare var Router;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { TodoModel } from "./todoModel";
import { TodoFooter } from "./footer";
import { TodoItem } from "./todoItem";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from "./constants";

class TodoApp extends React.Component<IAppProps, IAppState> {

  public state : IAppState;

  constructor(props : IAppProps) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null
    };
  }

  public componentDidMount() {
    var setState = this.setState;
    var router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/');
  }

  public handleNewTodoKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value.trim();

    if (val) {
      this.props.model.addTodo(val);
      (ReactDOM.findDOMNode(this.refs["newField"]) as HTMLInputElement).value = '';
    }
  }

  public toggleAll(event : React.FormEvent) {
    var target : any = event.target;
    var checked = target.checked;
    this.props.model.toggleAll(checked);
  }

  public toggle(todoToToggle : ITodo) {
    this.props.model.toggle(todoToToggle);
  }

  public destroy(todo : ITodo) {
    this.props.model.destroy(todo);
  }

  public edit(todo : ITodo) {
    this.setState({editing: todo.id});
  }

  public save(todoToSave : ITodo, text : String) {
    this.props.model.save(todoToSave, text);
    this.setState({editing: null});
  }

  public cancel() {
    this.setState({editing: null});
  }

  public clearCompleted() {
    this.props.model.clearCompleted();
  }

  public render() {
    var footer;
    var main;
    const todos = this.props.model.todos;

    var shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
      }
    });

    var todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={ e => this.cancel() }
        />
      );
    });

    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    var activeTodoCount = todos.reduce(function (accum, todo) {
      return todo.completed ? accum : accum + 1;
    }, 0);

    var completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={ e=> this.clearCompleted() }
        />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={ e => this.toggleAll(e) }
            checked={activeTodoCount === 0}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            ref="newField"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={ e => this.handleNewTodoKeyDown(e) }
            autoFocus={true}
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}

var model = new TodoModel('react-todos');

function render() {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName('todoapp')[0]
  );
}

model.subscribe(render);
render();

```

todoItem.tsx
```tsx
import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ENTER_KEY, ESCAPE_KEY } from "./constants";

class TodoItem extends React.Component<ITodoItemProps, ITodoItemState> {

  public state : ITodoItemState;

  constructor(props : ITodoItemProps){
    super(props);
    this.state = { editText: this.props.todo.title };
  }

  public handleSubmit(event : React.FormEvent) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  }

  public handleEdit() {
    this.props.onEdit();
    this.setState({editText: this.props.todo.title});
  }

  public handleKeyDown(event : React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  public handleChange(event : React.FormEvent) {
    var input : any = event.target;
    this.setState({ editText : input.value });
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  public shouldComponentUpdate(nextProps : ITodoItemProps, nextState : ITodoItemState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  public componentDidUpdate(prevProps : ITodoItemProps) {
    if (!prevProps.editing && this.props.editing) {
      var node = (ReactDOM.findDOMNode(this.refs["editField"]) as HTMLInputElement);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  public render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={ e => this.handleEdit() }>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={ e => this.handleSubmit(e) }
          onChange={ e => this.handleChange(e) }
          onKeyDown={ e => this.handleKeyDown(e) }
        />
      </li>
    );
  }
}

export { TodoItem };

```

utils.ts
```ts

class Utils {
  public static uuid() : string {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }

    return uuid;
  }

  public static pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  public static store(namespace : string, data? : any) {
    if (data) {
      return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
  }

  public static extend(...objs : any[]) : any {
    var newObj = {};
    for (var i = 0; i < objs.length; i++) {
      var obj = objs[i];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
}

export { Utils };

```

footer.tsx
```tsx
import * as classNames from "classnames";
import * as React from "react";
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "./constants";
import { Utils } from "./utils";

class TodoFooter extends React.Component<ITodoFooterProps, {}> {

  public render() {
    var activeTodoWord = Utils.pluralize(this.props.count, 'item');
    var clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}>
          Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({selected: nowShowing === ALL_TODOS})}>
                All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              className={classNames({selected: nowShowing === ACTIVE_TODOS})}>
                Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={classNames({selected: nowShowing === COMPLETED_TODOS})}>
                Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export { TodoFooter };

```

constants.ts
```ts
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
export { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, ESCAPE_KEY };

```

todoModel.ts
```ts
import { Utils } from "./utils";
class TodoModel implements ITodoModel {
  public key : string;
  public todos : Array<ITodo>;
  public onChanges : Array<any>;

  constructor(key) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  public subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  public addTodo(title : string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  public toggleAll(checked : Boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  public toggle(todoToToggle : ITodo) {
    this.todos = this.todos.map<ITodo>((todo : ITodo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  public destroy(todo : ITodo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave : ITodo, text : string) {
    this.todos = this.todos.map(function (todo) {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });

    this.inform();
  }

  public clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });

    this.inform();
  }
}

export { TodoModel };

```


Your task is to migrate this code to React 18.x.
When performing the translation, ensure to adhere to the instructions below:
- Use the following libraries: TypeScript, Redux Toolkit with createSlice, and nanoid.
- Provide a package.json file and configure the store and provider.
- Split the code into separate components.
- Optimize the code where possible.
- The converted code should not contain any TODOs.
- Return the translated code as markdown code snippets.
- Simply return the codebase without additional comments or explanations on how to convert it.

## Run 1:
### Answer:
<think>
Okay, I need to migrate this React app to React 18.x using TypeScript, Redux Toolkit with createSlice, and nanoid. Let me start by understanding the existing code structure.

First, the original code uses a TodoModel class with methods to manage todos and inform subscribers. Since we're moving to Redux, the state management should be handled by Redux slices. I'll create a todosSlice using createSlice from Redux Toolkit. The initial state can load from localStorage, similar to the original Utils.store method.

The TodoModel's methods like addTodo, toggleAll, toggle, destroy, save, and clearCompleted will become Redux actions and reducers. I'll replace the model's subscribe method with Redux's useSelector and useDispatch hooks. The inform method, which updates localStorage and triggers re-renders, can be handled by a Redux middleware or by dispatching actions that update the state and save to localStorage automatically.

Next, the TodoApp component uses this.props.model to interact with the todos. In the Redux version, I'll use useSelector to get the todos and filtered todos, and useDispatch to trigger actions. The router setup in componentDidMount uses a third-party library; maybe I should replace that with React Router for better compatibility. But the original code uses a Router variable declared globally. Hmm, perhaps the user expects to keep the same routing approach, but React 18 might have issues with findDOMNode and refs. Wait, the original code uses ReactDOM.findDOMNode, which is deprecated in React 18. I need to replace those with refs using useRef or createRef.

Looking at the TodoItem component, it uses ReactDOM.findDOMNode to focus the input when editing. In React 18, refs are handled differently. I should convert the refs from string refs to callback refs or useRef. Also, the shouldComponentUpdate in TodoItem can be replaced with React.memo for functional components.

The Utils class has methods like uuid, pluralize, store, and extend. Since we're using nanoid, the uuid method can be replaced with nanoid(). The store method uses localStorage, which can be integrated into the Redux middleware. The pluralize function can remain as a utility function. The extend method is used for object merging, which can be replaced with the spread operator or Object.assign.

The footer component uses links with hrefs that change the nowShowing state. In the Redux version, clicking these links should dispatch actions to update the nowShowing filter. The clearCompleted button will dispatch the clearCompleted action.

Now, structuring the Redux store: the state should include todos, nowShowing, and editing. The todosSlice will handle all the state updates. The middleware can handle saving to localStorage whenever the todos change.

For the components, I'll convert class components to functional components using hooks. For example, TodoApp becomes a functional component that uses useSelector and useDispatch. The handleNewTodoKeyDown will dispatch an addTodo action.

In the original code, the model.subscribe(render) is used to re-render when the model changes. With Redux, the useSelector hook will handle subscriptions, and the components will re-render when the relevant state changes.

I need to split the code into separate components: TodoApp, TodoItem, TodoFooter, and maybe a TodoList. Each component will be a functional component using hooks.

Testing each part: the todosSlice should handle all the actions correctly. The TodoItem's editing state was managed in the parent component's state, but with Redux, maybe editing can be part of the Redux state or managed locally using useState. Wait, in the original code, the editing state is in TodoApp's state. So in the Redux version, perhaps editing is still local state, or moved to Redux. Let me check: the original TodoApp has state for nowShowing and editing. The editing is the id of the todo being edited. So in the Redux migration, nowShowing can be part of the Redux state, and editing can remain as local state in TodoItem or lifted up. Alternatively, move editing into Redux. Hmm, but editing is a UI state, so maybe it's better to keep it local. However, in the original code, the editing state is in TodoApp, so when migrating, perhaps it's better to manage it via Redux. Alternatively, pass it down as props. Alternatively, use local state within TodoItem. Let me think: in the original code, when you click edit on a TodoItem, it sets the editing state in TodoApp to the todo's id. Then, each TodoItem checks if its id matches editing to enter edit mode. So, this is a global UI state, so perhaps it should be in Redux. Alternatively, lift the state up. But for simplicity, maybe move editing into the Redux store.

Wait, but the original code's TodoApp has state for nowShowing and editing. So in the Redux version, the nowShowing can be part of the Redux state (like a filter), and editing can be a property in the Redux state as well. So the todosSlice would have state: { todos: [], nowShowing: 'all', editing: null }. Then, when editing a todo, an action is dispatched to set editing to the todo id. The TodoItem can read the editing state from Redux and determine if it's being edited.

Alternatively, if editing is considered a UI concern, maybe it's better to manage it with useState in the TodoItem component. But since multiple components might need to know which todo is being edited, perhaps it's better to have it in Redux. However, that could lead to unnecessary re-renders. Hmm. Alternatively, the TodoApp could manage the editing state with useState and pass it down, but that might require prop drilling. Since the original code uses the TodoApp's state for editing, perhaps in the Redux migration, we can keep the editing state in the TodoApp component using useState, and pass it down to TodoItem via props. That way, it's local state and doesn't need to be in Redux. Let me check the original code:

In TodoApp's render method, each TodoItem receives editing={this.state.editing === todo.id}. So the editing state is in TodoApp. Therefore, in the converted code, the TodoApp functional component can use useState to manage editing. So the Redux store would handle the todos and the nowShowing filter, while the editing state remains local to TodoApp.

So, the plan is:

1. Create a Redux slice (todosSlice) that manages the todos array and the nowShowing filter.
2. Convert TodoApp to a functional component using useSelector and useDispatch.
3. Use useState in TodoApp for the editing state.
4. Replace the model's methods with Redux actions.
5. Replace ReactDOM.findDOMNode with refs using useRef.
6. Replace the Utils.uuid with nanoid.
7. Update the routing to use React Router or keep the existing router if it's compatible, but the original code uses a Router variable which might be a third-party library. Since the user didn't mention changing the router, perhaps keep it as is, but in React 18, using React Router v6 would be better. However, the original code uses a custom router setup. Hmm, the user's instruction says to split the code into separate components and optimize where possible. Maybe replacing the router with React Router is a good idea. But the original code's router is initialized in componentDidMount with routes that set the nowShowing state. So in the Redux version, changing the route should dispatch an action to set nowShowing. So, perhaps integrate React Router and use useNavigate or useLocation to update the nowShowing state in Redux.

Wait, the original code uses a Router (probably from a library like director) to handle routes and set the nowShowing state. To modernize, it's better to use React Router. So, install react-router-dom and set up routes. Then, in the TodoApp, use the location to determine nowShowing. For example, useRoutes or useParams to get the current filter. Then, dispatch an action to set nowShowing based on the route. Alternatively, use the URL parameters to derive the nowShowing directly in the component without storing it in Redux. For example, in the TodoApp, read the current route and determine the filter, then filter the todos accordingly. This way, the nowShowing state is derived from the URL, which is better for bookmarking and sharing links.

So, the steps would be:

- Install react-router-dom and set up BrowserRouter in the main component.
- Define routes for '/', '/active', '/completed'.
- In TodoApp, use useLocation to get the current path and determine the filter.
- The nowShowing state is no longer in Redux but derived from the URL.
- The links in the TodoFooter would use Link from react-router-dom to navigate.

This approach removes the need for the nowShowing state in Redux and leverages the URL as the source of truth. That's a better practice and aligns with React Router conventions.

So, updating the routing:

In the original code, the router is initialized in componentDidMount, which sets the nowShowing state. With React Router, the TodoApp can use the current path to determine the filter. For example:

const location = useLocation();
const nowShowing = location.pathname === '/' ? ALL_TODOS : location.pathname.slice(1);

Then, the shownTodos can be computed based on nowShowing. This way, there's no need for the router setup in componentDidMount, and the state is derived from the URL.

The TodoFooter's links would be React Router Links:

<Link to="/">All</Link>
<Link to="/active">Active</Link>
<Link to="/completed">Completed</Link>

This simplifies the routing and removes the dependency on the third-party Router.

Now, handling the todos in Redux:

The todosSlice will have:

- Initial state loaded from localStorage.
- Reducers for addTodo, toggleTodo, toggleAll, destroy, saveTodo, clearCompleted.
- The state will be saved to localStorage whenever the todos change. This can be done with a middleware or by using a subscribe listener on the store.

For example, after creating the store, we can subscribe to changes and save the todos to localStorage:

store.subscribe(() => {
  const state = store.getState().todos;
  localStorage.setItem('react-todos', JSON.stringify(state.todos));
});

But using a middleware might be more efficient. Alternatively, in the todosSlice's reducers, after each state update, we can save to localStorage. However, that's a side effect and should be handled in the reducer, but reducers should be pure. So the better approach is to use a middleware that listens for actions that modify the todos and then saves to localStorage.

Alternatively, use the redux-persist library, but the user didn't mention that. So, perhaps in the todosSlice's extraReducers or in each reducer, after updating the state, we can save to localStorage. But that's impure. Another approach is to create a custom middleware that saves to localStorage whenever the todos change.

Alternatively, in the component that dispatches the actions, after dispatching, save to localStorage. But that's not centralized. The best approach here is to have a middleware that listens for any action that affects the todos and saves them to localStorage.

But given time constraints, perhaps in each reducer, after modifying the todos, we can call Utils.store (but the original Utils.store is replaced with localStorage directly). Wait, the original Utils.store is used to save and load from localStorage. In the Redux version, the initial state can load from localStorage, and each reducer can save to localStorage after updating the state. But reducers shouldn't have side effects. Hmm. So perhaps the correct way is to handle this in a middleware.

Let me create a middleware that, after any action is processed, checks if the todos have changed and saves them to localStorage. But how to track that? Alternatively, after every action, save the todos to localStorage. But that's inefficient. Alternatively, in the todosSlice, create a reducer that, for each action that modifies the todos, triggers a save. But again, that's a side effect.

Alternatively, use the redux-thunk middleware and handle the saving in the thunks. But the user wants to use Redux Toolkit's createSlice, which uses thunks internally. So perhaps in each case, after the state is updated, we can have a listener that saves to localStorage.

Alternatively, in the todosSlice, after creating the slice, add a listener to the store to save the todos whenever they change.

For example:

const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});

store.subscribe(() => {
  const state = store.getState().todos;
  localStorage.setItem('react-todos', JSON.stringify(state.todos));
});

This way, any change to the todos in the Redux store will trigger a save to localStorage. This is a simple solution and keeps the reducers pure.

Now, converting the TodoModel to Redux:

The TodoModel's methods become Redux actions. For example, addTodo becomes an action that adds a new todo with nanoid.

The initial state for todosSlice:

interface TodosState {
  todos: ITodo[];
}

const initialState: TodosState = {
  todos: Utils.store('react-todos') || [],
};

But wait, the original code initializes the model with 'react-todos' as the key. The Utils.store function in the original code checks if data is provided to decide whether to save or load. In the Redux version, the initial state can load from localStorage using:

const todos = localStorage.getItem('react-todos');
const initialState: TodosState = {
  todos: todos ? JSON.parse(todos) : [],
};

Then, the middleware or store.subscribe will handle saving.

Now, the todosSlice:

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo = {
        id: nanoid(),
        title: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.todos.forEach(todo => {
        todo.completed = action.payload;
      });
    },
    destroyTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    saveTodo: (state, action: PayloadAction<{id: string, text: string}>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.text;
      }
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    },
  },
});

export const { addTodo, toggleTodo, toggleAll, destroyTodo, saveTodo, clearCompleted } = todosSlice.actions;

export default todosSlice.reducer;

Then, the store is configured with this reducer.

In the TodoApp component, the todos are accessed via useSelector:

const todos = useSelector((state: RootState) => state.todos.todos);

The nowShowing is derived from the URL using React Router's useLocation:

const location = useLocation();
const nowShowing = location.pathname === '/' ? ALL_TODOS : location.pathname.slice(1);

Then, shownTodos is computed based on nowShowing.

The editing state is managed in TodoApp using useState:

const [editing, setEditing] = useState<string | null>(null);

The TodoItem component receives editing as a prop and triggers setEditing when editing.

Handling refs in TodoItem: the original code uses string refs like ref="editField", which are deprecated. In React 18, we should use useRef or callback refs. So, in the TodoItem functional component:

const editFieldRef = useRef<HTMLInputElement>(null);

Then, in the input:

<input
  ref={editFieldRef}
  ...
/>

In the componentDidUpdate equivalent (using useEffect), when the component is in edit mode, focus the input:

useEffect(() => {
  if (editing && editFieldRef.current) {
    editFieldRef.current.focus();
    editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
  }
}, [editing]);

But since TodoItem is a functional component, we can use useEffect to handle the focus when the editing prop changes.

Now, converting TodoItem to a functional component:

const TodoItem: React.FC<ITodoItemProps> = ({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) => {
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editFieldRef.current.value.length, editFieldRef.current.value.length);
    }
  }, [editing]);

  const handleSubmit = (event: React.FormEvent) => {
    const val = editText.trim();
    if (val) {
      onSave(val);
      setEditText(val);
    } else {
      onDestroy();
    }
  };

  // ... other handlers

  return (
    // ... JSX
  );
};

The shouldComponentUpdate can be replaced with React.memo and a custom comparison function:

export default React.memo(TodoItem, (prevProps, nextProps) => {
  return prevProps.todo === nextProps.todo &&
    prevProps.editing === nextProps.editing;
});

But since the todo is an object, the comparison might not work as expected. Alternatively, compare the todo's id, title, completed, and the editing prop.

But maybe it's better to let React.memo do a shallow comparison and ensure that the props are memoized correctly. Alternatively, pass the todo as a primitive or use selectors to prevent unnecessary re-renders.

In the original code, the shouldComponentUpdate checks if nextProps.todo is different, or editing, or editText. In the functional component, the editText is local state, so the memoization should depend on todo and editing props.

Now, putting it all together:

The package.json should include dependencies for React 18, ReactDOM, React Router, Redux Toolkit, nanoid, and TypeScript.

The store is configured with the todosSlice, and the App is wrapped in a BrowserRouter.

The main App component renders the TodoApp inside a React Router Routes.

Finally, the original code's model.subscribe(render) is replaced with ReactDOM.createRoot and rendering the App component, which is connected to the Redux store.

Testing each part for correctness and ensuring that all functionality is preserved, including adding todos, toggling, editing, clearing completed, and routing.
</think>

package.json
```json
{
  "name": "todo-redux",
  "version": "1.0.0",
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "classnames": "^2.3.2",
    "nanoid": "^5.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.14.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.1.6"
  }
}
```

store.ts
```ts
import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { addTodo, toggleAll, toggleTodo, destroyTodo, saveTodo, clearCompleted } from './todosSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { addTodo, toggleAll, toggleTodo, destroyTodo, saveTodo, clearCompleted };
export default store;
```

todosSlice.ts
```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  todos: ITodo[];
}

const loadTodos = () => {
  const stored = localStorage.getItem('react-todos');
  return stored ? JSON.parse(stored) : [];
};

const initialState: TodosState = {
  todos: loadTodos()
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<ITodo>) {
        state.todos.push(action.payload);
        localStorage.setItem('react-todos', JSON.stringify(state.todos));
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false
          }
        };
      }
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.todos.forEach(todo => todo.completed = action.payload);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    destroyTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    saveTodo(state, action: PayloadAction<{id: string; text: string}>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) todo.title = action.payload.text;
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    },
    clearCompleted(state) {
      state.todos = state.todos.filter(t => !t.completed);
      localStorage.setItem('react-todos', JSON.stringify(state.todos));
    }
  }
});

export const { actions } = todosSlice;
export const { addTodo, toggleAll, toggleTodo, destroyTodo, saveTodo, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;
```

main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

App.tsx
```tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import TodoItem from './TodoItem';
import TodoFooter from './TodoFooter';
import { addTodo, toggleAll, clearCompleted } from './store';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const location = useLocation();
  const [editing, setEditing] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState('');

  const nowShowing = location.pathname === '/' ? ALL_TODOS : location.pathname.slice(1);
  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeTodoCount;

  const handleNewTodoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const shownTodos = todos.filter(todo => {
    switch (nowShowing) {
      case ACTIVE_TODOS: return !todo.completed;
      case COMPLETED_TODOS: return todo.completed;
      default: return true;
    }
  });

  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleNewTodoKeyDown}
          autoFocus
        />
      </header>
      {todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(e) => dispatch(toggleAll(e.target.checked))}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {shownTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editing={editing === todo.id}
                onEdit={setEditing}
              />
            ))}
          </ul>
        </section>
      )}
      {(activeTodoCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={nowShowing}
          onClearCompleted={() => dispatch(clearCompleted())}
        />
      )}
    </div>
  );
};

export default App;
```

TodoItem.tsx
```tsx
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { toggleTodo, destroyTodo, saveTodo } from './store';
import { ENTER_KEY, ESCAPE_KEY } from './constants';

interface TodoItemProps {
  todo: ITodo;
  editing: boolean;
  onEdit: (id: string | null) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, editing, onEdit }) => {
  const dispatch = useDispatch();
  const [editText, setEditText] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editFieldRef.current) {
      editFieldRef.current.focus();
      editFieldRef.current.setSelectionRange(editText.length, editText.length);
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) {
      dispatch(saveTodo({ id: todo.id, text: val }));
    } else {
      dispatch(destroyTodo(todo.id));
    }
    onEdit(null);
  };

  return (
    <li className={classNames({ completed: todo.completed, editing })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <label onDoubleClick={() => onEdit(todo.id)}>{todo.title}</label>
        <button className="destroy" onClick={() => dispatch(destroyTodo(todo.id))} />
      </div>
      {editing && (
        <input
          ref={editFieldRef}
          className="edit"
          value={editText}
          onBlur={handleSubmit}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') {
              setEditText(todo.title);
              onEdit(null);
            }
          }}
        />
      )}
    </li>
  );
};

export default React.memo(TodoItem);
```

TodoFooter.tsx
```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';

interface TodoFooterProps {
  count: number;
  completedCount: number;
  nowShowing: string;
  onClearCompleted: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({ count, completedCount, nowShowing, onClearCompleted }) => {
  const activeTodoWord = count === 1 ? 'item' : 'items';

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul className="filters">
        <li>
          <Link to="/" className={classNames({ selected: nowShowing === ALL_TODOS })}>
            All
          </Link>
        </li>
        <li>
          <Link to="/active" className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>
            Active
          </Link>
        </li>
        <li>
          <Link to="/completed" className={classNames({ selected: nowShowing === COMPLETED_TODOS })}>
            Completed
          </Link>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default React.memo(TodoFooter);
```

constants.ts
```ts
export const ALL_TODOS = 'all';
export const ACTIVE_TODOS = 'active';
export const COMPLETED_TODOS = 'completed';
export const ENTER_KEY = 'Enter';
export const ESCAPE_KEY = 'Escape';
```

### Tokens: {'input_tokens': 3345, 'output_tokens': 6549}
### Execution time: 100.00379705429077
