import React, { useContext } from "react";
import { useQuery } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";

import { readTodosRequest } from "../api/readTodosRequest";
import { TodoItem } from "../components/TodoItem";
import { CreateTodoForm } from "../components/CreateTodoForm";
import { TokenContext } from "../App";
import { useParams } from "react-router-dom";

export const TodoPage = () => {
  const { shoppingListId } = useParams();

  const [token] = useContext(TokenContext);

  const { isLoading, data: todos } = useQuery("todos", () =>
    readTodosRequest(shoppingListId, token)
  );

  return (
    <div>
      <h1 data-testid="todo-page-title-label">Todo App</h1>
      {isLoading ? (
        <div>
          <label data-testid="loading-spinner">Loading...</label>
          <ClipLoader size={150} />
        </div>
      ) : (
        <div data-testid="todos">
          {todos.map((todo) => (
            <TodoItem todo={todo} key={todo._id} />
          ))}
        </div>
      )}
      <div data-testid="create-todo">
        <CreateTodoForm shoppingListId={shoppingListId} />
      </div>
    </div>
  );
};
