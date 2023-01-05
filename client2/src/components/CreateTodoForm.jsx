import React, { useState, useContext, useRef } from "react";
import { useQueryClient, useMutation } from "react-query";
import createTodoRequest from '../api/createTodoRequest';
import { TokenContext } from "../App";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';



export const CreateTodoForm = ({ shoppingListId }) => {
    const [name, setName] = useState('');
    const nameInputRef = useRef();
    const [amount, setAmount] = useState(0);
    const [grammage, setGrammage] = useState('');
    const grammageInputRef = useRef();

    const [token] = useContext(TokenContext);

    const nameOptions = [
        { value: 'chleb', label: 'chleb' },
        { value: 'mleko', label: 'mleko' },
        { value: 'woda', label: 'woda' },
        { value: 'ser', label: 'ser' }
    ]

        const grammageOptions = [
        { value: 'szt', label: 'szt' },
        { value: 'kg', label: 'kg' },
        { value: 'g', label: 'g' },
        { value: 'm', label: 'm' }
    ]

    const customStyles = {        
        option: provided => ({
            ...provided,
            color: 'black'
        }),
        control: provided => ({
            ...provided,
            color: 'black'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    }

    const queryClient = useQueryClient();

    const { mutate: createTodo } = useMutation((newTodo) => {
        return createTodoRequest(newTodo, shoppingListId, token);
    }, {
        onSettled: () => {
            queryClient.invalidateQueries('todos')
        }
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            if (!name || name === '') return;
            if (!amount || amount === 0) return;
            if (!grammage || grammage === '') return;
            createTodo({
                name, amount, grammage
            })
            nameInputRef.current.clearValue()
            setName('');
            setAmount(0);
            grammageInputRef.current.clearValue()
            setGrammage('');
        }}>
            -------------------------------------------
            <br></br>
            Nazwa:
            <CreatableSelect isClearable options={nameOptions} styles={customStyles} ref={nameInputRef}
                onChange={(e) => {
                    if (e) setName(e.value)
                }}
            />
            Ilość:
            <br></br>
            <input
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value)
                }}
                step="0.01"
                presicion={2}
                type="number" />
            <br></br>
            Gramatura:
            <Select
                options={grammageOptions}
                ref={grammageInputRef}
                styles={customStyles} 
                onChange={(e) => {
                    if (e) setGrammage(e.value)
                }}
            />
            <br></br>
            <button>Create</button>
        </form>
        )
}