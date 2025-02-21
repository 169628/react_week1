import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Modal } from "bootstrap";
import "./assets/all.scss";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const [carts, setCarts] = useState({});

  // 取得產品與購物車資訊
  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗");
    }
  };
  const getCarts = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      const { success, data } = result.data;
      if (success) {
        setCarts(data);
      }
    } catch (error) {
      console.log(error);
      alert("取得購物車失敗");
    }
  };

  useEffect(() => {
    getProducts();
    getCarts();
  }, []);

  // 購物車相關
  const addToCart = async (id, num) => {
    try {
      const result = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id: id,
          qty: Number(num) || 1,
        },
      });
      const { success } = result.data;
      if (success) {
        alert("已加入購物車");
        getCarts();
      }
    } catch (error) {
      console.log(error);
      alert("加入購物車失敗");
    }
  };

  const deleteCarts = async () => {
    try {
      const result = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      const { success, message } = result.data;
      if (success) {
        alert(message);
        getCarts();
      }
    } catch (error) {
      console.log(error);
      alert("取得清除購物車失敗");
    }
  };

  const deleteFromCarts = async (id) => {
    try {
      const result = await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/cart/${id}`
      );
      const { success, message } = result.data;
      if (success) {
        alert(message);
        getCarts();
      }
    } catch (error) {
      console.log(error);
      alert("刪除失敗");
    }
  };

  const changeCartQty = async (cartId, product_id, qty) => {
    try {
      if (qty == 0) {
        deleteFromCarts(cartId);
      } else {
        const result = await axios.put(
          `${BASE_URL}/v2/api/${API_PATH}/cart/${cartId}`,
          {
            data: {
              product_id,
              qty: Number(qty),
            },
          }
        );
        const { success } = result.data;
        if (success) {
          getCarts();
        }
      }
    } catch (error) {
      console.log(error);
      alert("修改失敗");
    }
  };

  // Modal 相關
  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

  // 結帳相關

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const { message, ...other } = data;
      const result = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, {
        data: {
          user: {
            ...other,
          },
          message,
        },
      });
      const { success } = result.data;
      if (success) {
        alert(result.data.message);
        reset();
        getCarts();
      }
    } catch (error) {
      console.log(error);
      alert("結帳失敗");
    }
  };

  return (
    <div className="container">
      <div className="mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      onClick={() => handleSeeMore(product)}
                      type="button"
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        addToCart(product.id);
                      }}
                    >
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{" "}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
                  <select
                    value={qtySelect}
                    onChange={(e) => setQtySelect(e.target.value)}
                    id="qtySelect"
                    className="form-select"
                  >
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    addToCart(tempProduct.id, qtySelect);
                    closeModal();
                  }}
                >
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
        {carts.carts?.length > 0 && (
          <div>
            <div className="text-end py-3">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={deleteCarts}
              >
                清空購物車
              </button>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>

              <tbody>
                {carts.carts?.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            deleteFromCarts(item.id);
                          }}
                        >
                          x
                        </button>
                      </td>
                      <td>{item.product.title}</td>
                      <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => {
                                changeCartQty(
                                  item.id,
                                  item.product.id,
                                  item.qty - 1
                                );
                              }}
                            >
                              -
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: "50px", cursor: "auto" }}
                            >
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => {
                                changeCartQty(
                                  item.id,
                                  item.product.id,
                                  item.qty + 1
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {item.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{item.total}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計：{carts.total}
                  </td>
                  <td className="text-end" style={{ width: "130px" }}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              placeholder="請輸入 Email"
              {...register("email", {
                required: "Email欄位必填",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email格式錯誤",
                },
              })}
            />

            {errors.email && (
              <p className="text-danger my-2">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              className={`form-control ${errors.name && "is-invalid"}`}
              placeholder="請輸入姓名"
              {...register("name", {
                required: "姓名欄位必填",
              })}
            />

            {errors.name && (
              <p className="text-danger my-2">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="text"
              className={`form-control ${errors.tel && "is-invalid"}`}
              placeholder="請輸入電話"
              {...register("tel", {
                required: "電話必填",
                pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: "電話格式錯誤",
                },
              })}
            />
            {errors.tel && (
              <p className="text-danger my-2">{errors.tel.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className={`form-control ${errors.address && "is-invalid"}`}
              placeholder="請輸入地址"
              {...register("address", { required: "地址必填" })}
            />
            {errors.address && (
              <p className="text-danger my-2">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
