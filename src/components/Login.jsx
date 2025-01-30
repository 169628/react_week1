import React, { useState } from "react";
import axios from "axios";

function Login({ setIsAuth }) {
  const [formData, setFormData] = useState({
    username: "example@test.com",
    password: "example",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v2/admin/signin`,
        formData
      );
      if (result.data.success) {
        document.cookie = `hexToken=${result.data.token}; expires=${result.data.expired}`;
        axios.defaults.headers.common["Authorization"] = result.data.token;
        setIsAuth(true);
      } else {
        setFormData({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      setFormData({
        username: "",
        password: "",
      });
    }
  };

  return (
    <>
      <div className="container login">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  placeholder="name@example.com"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
}

export default Login;
