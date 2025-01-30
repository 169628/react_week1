import React, { useState } from "react";
import "./assets/all.scss";

import Product from "./components/Product";
import Login from "./components/Login";
//import './App.css'

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      {isAuth ? (
        <Product setIsAuth={setIsAuth} />
      ) : (
        <Login setIsAuth={setIsAuth} />
      )}
    </>
  );
}

export default App;
