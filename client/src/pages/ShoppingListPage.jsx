import React, { useContext } from "react";
import { useQuery } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";

import { readShoppingListsRequest } from "../api/readShoppingListsRequest";
import { ShoppingList } from "../components/ShoppingList";
import { CreateShoppingListForm } from "../components/CreateShoppingListForm";
import { TokenContext } from "../App";

export const ShoppingListPage = () => {
  const [token] = useContext(TokenContext);
  const { isLoading, data: shoppingLists } = useQuery("shoppingLists", () =>
    readShoppingListsRequest(token)
  );

  return (
    <div>
      <h1 data-testid="slpage-title-label">Shopping List App</h1>
      {isLoading ? (
        <div>
          <label data-testid="loading-spinner">Loading...</label>
          <ClipLoader size={150} />
        </div>
      ) : (
        <div data-testid="shopping-lists">
          {shoppingLists.map((shoppingList) => (
            <ShoppingList shoppingList={shoppingList} key={shoppingList._id} />
          ))}
        </div>
      )}
      <div data-testid="create-shopping-list-form">
        <CreateShoppingListForm />
      </div>
    </div>
  );
};
