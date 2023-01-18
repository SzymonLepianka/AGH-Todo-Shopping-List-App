import React, { useCallback, useState, useEffect, useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import { updateTodoRequest } from "../api/updateTodoRequest";
import { deleteTodoRequest } from "../api/deleteTodoRequest";
import { debounce } from "lodash";
import { TokenContext } from "../App";

export const TodoItem = ({ todo }) => {
  const [name, setName] = useState(todo.name);
  const [amount, setAmount] = useState(todo.amount);
  const [grammage, setGrammage] = useState(todo.grammage);
  const [token] = useContext(TokenContext);

  const queryClient = useQueryClient();

  const { mutate: updateTodo } = useMutation(
    (updatedTodo) => {
      return updateTodoRequest(updatedTodo, token);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const { mutate: deleteTodo } = useMutation(
    (updatedTodo) => {
      return deleteTodoRequest(updatedTodo, token);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const debouncedUpdateTodo = useCallback(debounce(updateTodo, 600), [
    updateTodo,
  ]);

  useEffect(() => {
    if (name !== todo.name) {
      debouncedUpdateTodo({ ...todo, name });
    }
  }, [name]);

  return (
    <div>
      <input
        checked={todo.completed}
        type="checkbox"
        data-testid="completed-todo-input"
        value={todo.name}
        onChange={() => {
          updateTodo({
            ...todo,
            completed: !todo.completed,
          });
        }}
      />
      {todo.completed ? (
        <span
          data-testid="completed-todo-label"
          style={{ textDecoration: "line-through" }}
        >
          <label data-testid="crossed-todo-name-label">{` ${name} `}</label>
        </span>
      ) : (
        <label data-testid="uncrossed-todo-name-label">{` ${name} `}</label>
      )}
      <label data-testid="amount-todo-label">{` ${amount} `}</label>
      <label data-testid="grammage-todo-label">{` ${grammage} `}</label>
      <button data-testid="delete-todo-button" onClick={() => deleteTodo(todo)}>
        Delete
      </button>
    </div>
  );
};
