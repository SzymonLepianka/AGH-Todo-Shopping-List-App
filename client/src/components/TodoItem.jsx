import React, { useCallback, useState, useEffect, useContext } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import updateTodoRequest from '../api/updateTodoRequest';
import deleteTodoRequest from '../api/deleteTodoRequest';
import { debounce } from 'lodash';
import { TokenContext } from '../App';

export const TodoItem = ({ todo }) => {

    const [text, setText] = useState(todo.text)
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
        if (text !== todo.text) {
            debouncedUpdateTodo({...todo, text})
        }
    }, [text]);


    return (
        <div>
            <input checked={todo.completed} type="checkbox" value={todo.text} onChange={() => {
                updateTodo({
                    ...todo,
                    completed: !todo.completed
                })
            }} />
            <input type="text" value={text} onChange={(e) => {
                setText(e.target.value)
            }} />
            <button onClick={()=>deleteTodo(todo)}>Delete</button>
        </div>
    )
}