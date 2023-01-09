import React, { useContext } from "react";
import { useQuery } from "react-query";
import ClipLoader from "react-spinners/ClipLoader";

import readShoppingListsRequest from "../api/readShoppingListsRequest";
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
      <h1>Shopping List App</h1>
      {isLoading ? (
        <ClipLoader size={150} />
      ) : (
        shoppingLists.map((shoppingList) => (
          <ShoppingList shoppingList={shoppingList} key={shoppingList._id} />
        ))
      )}
      <div data-testid="create-shopping-list-form">
        <CreateShoppingListForm />
      </div>
    </div>
  );
};
