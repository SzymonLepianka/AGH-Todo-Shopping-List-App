import React, { useCallback, useState, useEffect, useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import { updateShoppingListRequest } from "../api/updateShoppingListRequest";
import { deleteShoppingListRequest } from "../api/deleteShoppingListRequest";
import { debounce } from "lodash";
import { TokenContext } from "../App";
import { useNavigate } from "react-router-dom";

export const ShoppingList = ({ shoppingList }) => {
  const [shoppingListId, setShoppingListId] = useState(
    shoppingList.shoppingListId
  );
  const [name, setName] = useState(shoppingList.name);
  const [date, setDate] = useState(shoppingList.date);
  const [token] = useContext(TokenContext);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: updateShoppingList } = useMutation(
    (updatedShoppingList) => {
      return updateShoppingListRequest(updatedShoppingList, token);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("shoppingLists");
      },
    }
  );

  const { mutate: deleteShoppingList } = useMutation(
    (updatedShoppingList) => {
      return deleteShoppingListRequest(updatedShoppingList, token);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("shoppingLists");
      },
    }
  );

  const debouncedUpdateShoppingList = useCallback(
    debounce(updateShoppingList, 600),
    [updateShoppingList]
  );

  useEffect(() => {
    if (name !== shoppingList.name) {
      if (!name) return;
      if (name.length > 50) return;
      if (name.length < 2) return;
      const illegalRegexExp = /.*[!,%&*].*/;
      if (illegalRegexExp.test(name)) return;
      debouncedUpdateShoppingList({ ...shoppingList, name });
    }
  }, [name]);

  return (
    <div>
      <input
        checked={shoppingList.completed}
        type="checkbox"
        value={shoppingList.name}
        data-testid="shoppingList-completed-input"
        onChange={() => {
          updateShoppingList({
            ...shoppingList,
            completed: !shoppingList.completed,
          });
        }}
      />
      <label data-testid="shoppingList-name-label">{`Nazwa: `}</label>
      <input
        type="text"
        value={name}
        data-testid="shoppingList-name-input"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <label data-testid="shoppingList-date-label">{` Sugerowana data wykonania: `}</label>
      <label data-testid="shoppingList-date-content">{date}</label>
      {` `}
      <button
        data-testid="shoppingList-delete-button"
        onClick={() => deleteShoppingList(shoppingList)}
      >
        Delete
      </button>
      {` `}
      <button
        data-testid="shoppingList-details-button"
        onClick={() => navigate("/details/" + shoppingListId)}
      >
        Szczegóły
      </button>
    </div>
  );
};
