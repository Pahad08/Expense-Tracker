import { useState, useReducer, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Card from "./card.jsx";
import Input from "./input.jsx";
import Swal from "sweetalert2";

const getDate = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const newDate = new Date();
  const year = newDate.getFullYear();
  const month = months[newDate.getMonth()];
  const date = newDate.getDate();
  const hours =
    newDate.getHours() % 12 == 0 ? 12 : addZero(newDate.getHours() % 12);
  const minute =
    newDate.getMinutes() > 10
      ? newDate.getMinutes()
      : addZero(newDate.getMinutes());
  const meridiem = hours >= 12 ? "PM" : "AM";
  const time = `${hours}:${minute}`;
  const fullDate = `${month} ${date} ${year} ${time} ${meridiem}`;

  return fullDate;
};

const addZero = (date) => {
  return "0" + date;
};

const reducer = (
  state,
  { action, name, amount, date, object, budget, index, myExpense }
) => {
  switch (action) {
    case "add":
      if (budget == 0 || amount > budget) {
        Swal.fire({
          title: "No Budget!",
          text: "Add an Amount",
          icon: "error",
        });

        return state;
      }

      if (name == "" || amount == "") {
        Swal.fire({
          title: "Empty Inputs!",
          text: "Enter an input",
          icon: "info",
        });
        return state;
      }

      const currBudget = JSON.parse(localStorage.getItem("budget")).amount;

      localStorage.setItem(
        "budget",
        JSON.stringify({ budget: "budget", amount: currBudget - amount })
      );

      localStorage.setItem(
        name,
        JSON.stringify({ name: name, amount: amount, date: getDate() })
      );

      const tempExpense = parseFloat(amount) + parseFloat(myExpense);

      localStorage.setItem(
        "total_expense",
        JSON.stringify({ amount: tempExpense })
      );

      Swal.fire({
        title: "Added Expense!",
        icon: "success",
      });

      return [{ name: name, amount: amount, date: getDate() }, ...state];

    case "addList":
      return [...state, object];

    case "delete":
      localStorage.removeItem(name);

      state = state.filter((_, i) => {
        return i !== index;
      });

      return state;
    default:
      return [];
  }
};

export default function Index() {
  const [expenses, dispatch] = useReducer(reducer, []);
  const [expenseName, handleExpenseName] = useState("");
  const [amount, handleAmount] = useState(0);
  const [budget, handleBudget] = useState(0);
  const [myExpense, handleExpense] = useState({ amount: 0 });
  const btn = useRef(null);

  useEffect(() => {
    const newBudget = JSON.parse(localStorage.getItem("budget"))
      ? JSON.parse(localStorage.getItem("budget")).amount
      : 0;
    handleBudget(newBudget);

    const newExpense = JSON.parse(localStorage.getItem("total_expense"))
      ? JSON.parse(localStorage.getItem("total_expense")).amount
      : 0;

    handleExpense((myExpense) => {
      return {
        ...myExpense,
        amount: newExpense,
      };
    });
  }, [expenses]);

  useEffect(() => {
    const pushLocalStorageData = () => {
      for (let index = 0; index < localStorage.length; index++) {
        const object = JSON.parse(
          localStorage.getItem(localStorage.key(index))
        );

        const objKey = localStorage.key(index);

        if (objKey !== "budget" && objKey !== "total_expense") {
          dispatch({ action: "addList", object: object });
        }
      }
    };

    pushLocalStorageData();
  }, []);

  useEffect(() => {
    const clear = () => {
      localStorage.clear();
      dispatch({});
      console.log("clciked");
    };

    btn.current.addEventListener("click", clear);

    return () => {
      if (btn.current) {
        btn.current.removeEventListener("click", clear);
      }
    };
  }, []);

  return (
    <>
      <div className="title">
        <p className="title-text" draggable="false">
          Expense Tracker
        </p>
      </div>

      <div className="router">
        <Link to="/addbudget">Add Budget</Link>
      </div>

      <form className="expense-form">
        <div className="input-container">
          <Input
            type="text"
            inputId="expense-name"
            placeholder="Expense Name"
            functionHandle={handleExpenseName}
            label="expense-name"
            labelId="expense-label"
            labelName="Expense Name"
          />
        </div>

        <div className="input-container">
          <Input
            type="number"
            inputId="expense-amount"
            placeholder="Amount"
            functionHandle={handleAmount}
            label="expense-amount"
            labelId="amount-label"
            labelName="Amount"
          />
        </div>

        <button
          className="add-btn"
          onClick={(e) => {
            e.preventDefault();
            dispatch({
              action: "add",
              name: expenseName,
              amount: amount,
              budget: budget,
              myExpense: myExpense.amount,
            });
          }}
        >
          Add
        </button>
      </form>

      <div className="cards">
        <Card id="budget" title="Budget" amount={budget} />
        <Card id="expenses" title="Total Expenses" amount={myExpense.amount} />
        <button className="clear" ref={btn}>
          Clear
        </button>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((element, index) => {
            return (
              <tr key={index}>
                <td>{element.name}</td>
                <td>{element.amount}</td>
                <td>{element.date}</td>
                <td className="delete-btn">
                  <button
                    onClick={() => {
                      dispatch({
                        action: "delete",
                        name: element.name,
                        index: index,
                      });
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td className="edit-btn">
                  <button>Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
