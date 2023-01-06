import React, { useCallback, useState, useEffect, useContext } from "react";
import { useQueryClient, useMutation } from "react-query";
import updateShoppingListRequest from "../api/updateShoppingListRequest";
import deleteShoppingListRequest from "../api/deleteShoppingListRequest";
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
      debouncedUpdateShoppingList({ ...shoppingList, name });
    }
  }, [name]);

  return (
    <div>
      <input
        checked={shoppingList.completed}
        type="checkbox"
        value={shoppingList.name}
        onChange={() => {
          updateShoppingList({
            ...shoppingList,
            completed: !shoppingList.completed,
          });
        }}
      />
      {`Nazwa: `}
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      {` Sugerowana data wykonania: `}
      {date}
      {` `}
      <button onClick={() => deleteShoppingList(shoppingList)}>Delete</button>
      {` `}
      <button onClick={() => navigate("/details/" + shoppingListId)}>
        Szczegóły
      </button>
    </div>
  );
};
