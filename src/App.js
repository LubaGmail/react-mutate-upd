import './App.css';
import React from 'react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
  useMutation,
  gql
} from "@apollo/client";


const GET_TODOS = gql`
{
  todos {
    id
    type
  }
}
`;

const UPDATE_TODO = gql`
  mutation ($id: String!, $type: String!) {
    updateTodo(id: $id, type: $type) {
      id
      type
    }
  }
`;

function App() {
  const client = new ApolloClient({
    uri: "https://sxewr.sse.codesandbox.io/",
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h4>App - wrap downstream components inside ApolloProvider</h4>
        <Main />

      </div>
    </ApolloProvider>

  );

}

const Main = () => {
  const {loading, error, data } = useQuery(GET_TODOS);
  const [todos, setTodos] = React.useState([]);
  const [todoType, setTodoType] = React.useState('')

  const [
    updateTodo,
    { loading: mutLoading, error: mutError }
  ] = useMutation(UPDATE_TODO);

  React.useEffect( () => {
    setTodos(data?.todos)
  }, [data])

  if (loading)  return <p>Loading...</p> 
  if (error) return <p>Error :(</p>;
  if (!todos) return <p></p>

  const handleChange = (e, id, type) => {
    // console.log('handleChange', id, type, e.target.value)
    setTodoType(e.target.value)
  }

  const handleUpdate = (e, id, type) => {
    // console.log('handleUpdate',  id, todoType)

    updateTodo({ variables: { id, type: todoType } });
    // console.log('afterUpdateTodo', mutError, mutLoading)
  }

  return (
    <>
      <h4>Main - maintain state </h4>
      <Todos 
        todos={todos} onHandleChange={handleChange} onHandleUpdate={handleUpdate}
      />
    </>
  )
}

const Todos = ({todos, onHandleChange, onHandleUpdate}) => {
  // console.log('todos', todos)

  return (
    <>
      <h5>Todos - handle input</h5>
        <table>
        <tbody>
        {
          todos.map( ({id, type}) => (
            <tr key={id}>
              <td>{type} </td>
              <td>
              <input id='type' name='type' 
                  onChange={(e) => onHandleChange(e, id, type)}
              />
              </td>

              <td>
              <button className='updB' onClick={(e) => onHandleUpdate(e, id, type)}>Update</button>
              </td>
            </tr>
          ))
        }
        </tbody>
        </table>
    </>
  )
}

export default App;
