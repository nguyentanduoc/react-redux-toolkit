import React, { useState } from "react";
import "./App.css";
import SpingningComponent from "./SpingningComponent";
import { ILogin, login } from "./actions/authActions";
import { useGetAllUserQuery, useGetByIdMutation } from "./services/authService";
import { selectToken } from "./slice/auth.slice";
import { useAppDispatch, useAppSelector } from "./store";

function App() {
  const [formData, setFormData] = useState<ILogin>();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      dispatch(login(formData));
    }
  };
  const token = useAppSelector(selectToken);

  const { data } = useGetAllUserQuery("userDetails", {
    skip: !token,
  });

  const [getByIdMutation] = useGetByIdMutation();
  const getById = async () => {
    const data1 = await getByIdMutation("1").unwrap();
    console.log(data1);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">username</label>
        <input
          name="username"
          onChange={(e) =>
            setFormData((pre) => ({ ...pre, username: e.target.value }))
          }
        />
        <label htmlFor="password">password</label>
        <input
          name="password"
          onChange={(e) =>
            setFormData((pre) => ({ ...pre, password: e.target.value }))
          }
        />
        <button type="submit">submit</button>
        <br />
        <button type="button" onClick={getById}>
          getById
        </button>
      </form>
      <SpingningComponent />
    </div>
  );
}

export default App;
