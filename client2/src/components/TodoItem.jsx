import React, { useCallback, useState, useEffect, useContext } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import updateTodoRequest from '../api/updateTodoRequest';
import deleteTodoRequest from '../api/deleteTodoRequest';
import { debounce } from 'lodash';
import { TokenContext } from '../App';

export const TodoItem = ({ todo }) => {

    const [name, setName] = useState(todo.name)
    const [amount, setAmount] = useState(todo.amount)
    const [grammage, setGrammage] = useState(todo.grammage)
    const [token] = useContext(TokenContext);
    
    const queryClient = useQueryClient();

    const { mutate: updateTodo } = useMutation((updatedTodo) => {
        return updateTodoRequest(updatedTodo, token);
    }, {
        onSettled: () => {
            queryClient.invalidateQueries('todos')
        }
    })

    const { mutate: deleteTodo } = useMutation((updatedTodo) => {
        return deleteTodoRequest(updatedTodo, token);
    }, {
        onSettled: () => {
            queryClient.invalidateQueries('todos')
        }
    })

    const debouncedUpdateTodo = useCallback(debounce(updateTodo, 600), [updateTodo]);

    useEffect(() => {
        if (name !== todo.name) {
            debouncedUpdateTodo({...todo, name})
        }
    }, [name]);


    return (
        <div>
            <input checked={todo.completed} type="checkbox" value={todo.name} onChange={() => {
                updateTodo({
                    ...todo,
                    completed: !todo.completed
                })
            }} />
            {todo.completed ? <span style={{textDecoration: 'line-through'}}>{` ${name} `}</span> : ` ${name} `}
            {` ${amount} `}
            {` ${grammage} `}
            <button onClick={()=>deleteTodo(todo)}>Delete</button>
        </div>
    )
}