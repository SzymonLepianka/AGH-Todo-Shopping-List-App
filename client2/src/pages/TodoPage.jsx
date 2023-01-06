import React, { useContext } from "react";
import { useQuery } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";

import readTodosRequest from "../api/readTodosRequest";
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
      <h1>Todo App</h1>
      {isLoading ? (
        <ClipLoader size={150} />
      ) : (
        todos.map((todo) => <TodoItem todo={todo} key={todo._id} />)
      )}
      <CreateTodoForm shoppingListId={shoppingListId} />
    </div>
  );
};
