import React, { useState, useContext, useRef } from "react";
import { useQueryClient, useMutation } from "react-query";
import { createTodoRequest } from "../api/createTodoRequest";
import { TokenContext } from "../App";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export const CreateTodoForm = ({ shoppingListId }) => {
  const [name, setName] = useState("");
  const nameInputRef = useRef();
  const [amount, setAmount] = useState(0);
  const [grammage, setGrammage] = useState("");
  const grammageInputRef = useRef();

  const [token] = useContext(TokenContext);

  const nameOptions = [
    { value: "chleb", label: "chleb" },
    { value: "mleko", label: "mleko" },
    { value: "woda", label: "woda" },
    { value: "ser", label: "ser" },
  ];

  const grammageOptions = [
    { value: "szt", label: "szt" },
    { value: "kg", label: "kg" },
    { value: "g", label: "g" },
    { value: "m", label: "m" },
  ];

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: "black",
    }),
    control: (provided) => ({
      ...provided,
      color: "black",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  const queryClient = useQueryClient();

  const { mutate: createTodo } = useMutation(
    (newTodo) => {
      return createTodoRequest(newTodo, shoppingListId, token);
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  return (
    <form
      data-testid="create-todo-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name || name === "") return;
        if (!amount || amount === 0) return;
        if (!grammage || grammage === "") return;
        if (name.length > 50) return;
        if (amount > 100000) return;
        if (grammage.length > 10) return;
        const illegalRegexExp = /.*[!,%&*].*/;
        if (illegalRegexExp.test(name)) return;
        if (
          grammage !== "szt" &&
          grammage !== "kg" &&
          grammage !== "g" &&
          grammage !== "m"
        )
          return;
        createTodo({
          name,
          amount,
          grammage,
        });
        nameInputRef.current.clearValue();
        setName("");
        setAmount(0);
        grammageInputRef.current.clearValue();
        setGrammage("");
      }}
    >
      -------------------------------------------
      <br></br>
      <label data-testid="todo-name-label">{`Nazwa: `}</label>
      <div data-testid="todo-name-input">
        <CreatableSelect
          isClearable
          options={nameOptions}
          styles={customStyles}
          ref={nameInputRef}
          // name="nameee"
          inputId="name-content-input"
          // inputProps={{ "data-testid": "name-content-input" }}
          placeholder={"Select name"}
          onChange={(e) => {
            if (e) setName(e.value);
          }}
        />
      </div>
      <label data-testid="todo-amount-label">{`Ilość: `}</label>
      <br></br>
      <input
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        step="0.01"
        presicion={2}
        type="number"
        data-testid="todo-amount-input"
      />
      <br></br>
      <label data-testid="todo-grammage-label">{`Gramatura: `}</label>
      <div data-testid="todo-grammage-input">
        <Select
          options={grammageOptions}
          ref={grammageInputRef}
          styles={customStyles}
          inputId="grammage-content-input"
          placeholder={"Select grammage"}
          onChange={(e) => {
            if (e) setGrammage(e.value);
          }}
        />
      </div>
      <br></br>
      <button data-testid="create-todo-button">Create TODO</button>
    </form>
  );
};
