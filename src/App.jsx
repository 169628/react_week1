import React, { useState } from "react";
import "./assets/all.scss";

import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [apiPath, setApiPath] = useState("");

  return (
    <>
      {isAuth ? (
        <ProductPage setIsAuth={setIsAuth} apiPath={apiPath} />
      ) : (
        <LoginPage
          setIsAuth={setIsAuth}
          setApiPath={setApiPath}
          apiPath={apiPath}
        />
      )}
    </>
  );
}

export default App;
