import React, { useState } from "react";
import "./assets/all.scss";

import Product from "./components/Product";
import Login from "./components/Login";
//import './App.css'

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [apiPath, setApiPath] = useState("");

  return (
    <>
      {isAuth ? (
        <Product setIsAuth={setIsAuth} apiPath={apiPath} />
      ) : (
        <Login
          setIsAuth={setIsAuth}
          setApiPath={setApiPath}
          apiPath={apiPath}
        />
      )}
    </>
  );
}

export default App;
