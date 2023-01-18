import React, { useState, useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import { createShoppingListRequest } from "../api/createShoppingListRequest";
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

  const dateIsValid = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateStr.match(regex) === null) {
      return false;
    }

    const date = new Date(dateStr);

    // const timestamp = date.getTime();
    // if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    //   return false;
    // }

    return date.toISOString().startsWith(dateStr);
  };

  return (
    <form
      data-testid="create-sl-form"
      onSubmit={(e) => {
        e.preventDefault();

        if (!name || !date) return;
        if (name.length > 50) return;
        // if (date.length > 50) return;
        if (name.length < 2) return;
        // if (date.length < 5) return;
        const illegalRegexExp = /.*[!,%&*].*/;
        if (illegalRegexExp.test(name)) return;
        // if (illegalRegexExp.test(date)) return;
        if (!dateIsValid(date)) return;

        createShoppingList({
          name,
          date,
        });
        setName("");
        setDate("");
      }}
    >
      <label data-testid="name-label">{`Nazwa: `}</label>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
        data-testid="name-input"
        type="text"
      />
      <label data-testid="date-label">{` Sugerowana data wykonania: `}</label>
      <input
        onChange={(e) => {
          setDate(e.target.value);
        }}
        value={date}
        data-testid="date-input"
        type="date"
      />
      {` `}
      <button data-testid="create-sl-button">Create SL</button>
    </form>
  );
};
