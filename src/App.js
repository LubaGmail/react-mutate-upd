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

function App() {
  const client = new ApolloClient({
    uri: "https://sxewr.sse.codesandbox.io/",
    cache: new InMemoryCache()
  });

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

  const Todos = () => {
    const {loading, error, data } = useQuery(GET_TODOS);
    const [todos, setTodos] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [message, setMessage] = React.useState('')

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

    const handleChange = (e, i) => {
      setInput(e.target.value)
      // console.log('input', input)
    }
  
    console.log('todos', todos)

    const handleSubmit = (e, id, type) => {
      e.preventDefault()
      // console.log('handleSubmit', id, type, input)
      updateTodo({ variables: { id, type: input } });
      setMessage(`Todo type updated to ${input}`)
      setInput('')
    }

    return (
      <>
        <form
          onReset={e => {
            setInput('')
            setMessage('')
          }}
        >
          <table>
              <thead>
                <tr>
                  <th>Current Value</th>
                  <th>New Value</th>      
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {
                todos.map( ({id, type}) => (
                  <tr key={id}>
                    <td>{type}</td>
                    <td>
                      <input id='type' name='type' 
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <button type='submit' className='updB' onClick={(e) => handleSubmit(e, id, type)}>Update</button>
                    </td>
                    <td>
                    <button type='reset' className='resetB'>Reset</button>
                    </td>
                  </tr>
                ))
              }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan='4'>
                    <b>Messages: </b>
                    {message}
            
                  </td>
                </tr>
              </tfoot>
          </table>
        </form>

      </>
    )
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h3>React GraphQL / useMutation / Update</h3>

        <Todos />

      </div>
    </ApolloProvider>

  );
}

export default App;
