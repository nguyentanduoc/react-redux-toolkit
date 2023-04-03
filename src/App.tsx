import React, { useState } from "react";
import "./App.css";
import { ILogin, login } from "./actions/authActions";
import { useAppDispatch } from "./store";
import { useGetAllUserQuery } from "./services/authService";

function App() {
  const [formData, setFormData] = useState<ILogin>();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      dispatch(login());
    }
  };

  const { data, isFetching } = useGetAllUserQuery("userDetails", {
    skip: !localStorage.getItem("token"),
  });

  console.log(data);

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
      </form>
    </div>
  );
}

export default App;
