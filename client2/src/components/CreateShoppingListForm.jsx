import React, { useState, useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import createShoppingListRequest from "../api/createShoppingListRequest";
import { TokenContext } from "../App";

export const CreateShoppingListForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [token] = useContext(TokenContext);

  const queryClient = useQueryClient();

  const { mutate: createShoppingList } = useMutation(
    (newShoppingList) => {
      return createShoppingListRequest(newShoppingList, token);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("shoppingLists");
      },
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name || !date) return;
        createShoppingList({
          name,
          date,
        });
        setName("");
        setDate("");
      }}
    >
      {`Nazwa: `}
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
        type="text"
      />
      {` Sugerowana data wykonania: `}
      <input
        onChange={(e) => {
          setDate(e.target.value);
        }}
        value={date}
        type="date"
      />
      {` `}
      <button>Create SL</button>
    </form>
  );
};
