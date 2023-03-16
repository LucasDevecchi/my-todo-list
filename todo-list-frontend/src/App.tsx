import { useEffect, useState } from 'react';
import './styles/app.css';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { Close } from '@material-ui/icons';
import { useFetch } from './hooks/useFetch';
import axios from 'axios';


const App = () => {

  interface Todo {
    _id?: number | undefined,
    name: string,
    done: boolean;
  };

  const queryUrl: string = "http://localhost:6969/api/todos";
  const { data, loading } = useFetch(queryUrl);
  const [query, setQuery] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>();

  useEffect(() => {
    setTodos(data);
  }, [data]);

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(target.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (query.trim().length === 0 || query.length > 38) {
      setQuery('');
      return;
    }

    if (todos === undefined) return;

    if (todos.length >= 10) {
      Swal.fire({
        icon: 'error',
        title: "¡MAXIMUM LIMIT OF TO-DO's REACHED!",
      });
      setQuery('');
      return;
    };

    if (todos.findIndex(todo => todo.name === query) >= 0) {
      Swal.fire({
        icon: 'error',
        title: "¡IDENTICAL TO-DO's ARE NOT ALLOWED!",
      });
      setQuery('');
      return;
    };

    const newTodo: Todo = {
      name: query,
      done: false
    };

    const previousTodo = todos || [];

    const res = await axios.post(queryUrl, newTodo);

    const addedTodo = res.data;

    setTodos([...previousTodo, addedTodo]);
    setQuery('');
  };

  const handleToggle = async (id: Todo["_id"]) => {
    if (todos === undefined) return;
    const updatedList = todos.map((todo: Todo) => (todo._id === id ? { ...todo, done: !todo.done } : todo));

    const todo = todos.find(todo => todo._id === id);
    if (todo !== undefined) {
      todo.done = !todo.done;
    }

    await axios.put(`${queryUrl}/${id}`, todo)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.error(error.response.data);
      });
    setTodos(updatedList);
  };

  const handleDelete = async (id: Todo["_id"]) => {
    if (todos === undefined) return;
    const updatedList = todos.filter(todo => todo._id !== id);
    await axios.delete(`${queryUrl}/${id}`)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.error(error.response.data);
      });
    setTodos(updatedList);
  };

  return (
    <>
      <form className="general-content" onSubmit={e => handleSubmit(e)}>
        <h1 className="todo-title">My TODO-LIST</h1>
        <label htmlFor="todo-input" className="todo-input-title">Add any todo you want!   ;)</label>
        <input
          id="todo-input"
          className="todo-input"
          type="text"
          placeholder="My Todo"
          value={query}
          onChange={(e) => handleInputChange(e)}
        />
      </form>

      <div className="todo-container">
        {
          loading
            ? <p>Loading</p>
            :
            <div className={todos !== undefined && todos.length > 0 ? "todo-wrap" : ""}>
              {
                todos !== undefined && todos.length > 0 ?
                  todos.map(todo => (
                    <div key={todo._id} className={todo.done ? "todo-done" : "todo"}>
                      <li style={{ width: "100%" }} onClick={() => handleToggle(todo._id)}>{todo.name}</li>
                      <Close className='asd' onClick={() => handleDelete(todo._id)} />
                    </div>
                  ))
                  : <></>
              }
            </div>
        }
      </div>
    </>
  );
};
export default App;