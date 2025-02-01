import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

//import ProductModal from "../modals/productModal";

function Product({ setIsAuth, apiPath }) {
  //const [tempProduct, setTempProduct] = useState(null);
  const [products, setProducts] = useState([
    // {
    //   category: "甜甜圈",
    //   content: "尺寸：14x14cm",
    //   description:
    //     "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
    //   id: "-L9tH8jxVb2Ka_DYPwng",
    //   is_enabled: 1,
    //   origin_price: 150,
    //   price: 99,
    //   title: "草莓莓果夾心圈",
    //   unit: "元",
    //   num: 10,
    //   imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
    //   imagesUrl: [
    //     "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
    //     "https://images.unsplash.com/photo-1559656914-a30970c1affd",
    //   ],
    // },
    // {
    //   category: "蛋糕",
    //   content: "尺寸：6寸",
    //   description:
    //     "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
    //   id: "-McJ-VvcwfN1_Ye_NtVA",
    //   is_enabled: 1,
    //   origin_price: 1000,
    //   price: 900,
    //   title: "蜂蜜檸檬蛋糕",
    //   unit: "個",
    //   num: 1,
    //   imageUrl:
    //     "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
    //   imagesUrl: [
    //     "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
    //   ],
    // },
    // {
    //   category: "蛋糕",
    //   content: "尺寸：6寸",
    //   description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
    //   id: "-McJ-VyqaFlLzUMmpPpm",
    //   is_enabled: 1,
    //   origin_price: 700,
    //   price: 600,
    //   title: "暗黑千層",
    //   unit: "個",
    //   num: 15,
    //   imageUrl:
    //     "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
    //   imagesUrl: [
    //     "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
    //     "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
    //   ],
    // },
  ]);
  const productModalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const [mode, setMode] = useState("");
  const defaultProduct = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  };
  const [modalProduct, setModalProduct] = useState(defaultProduct);
  const [deleteProduct, setDeleteProduct] = useState({});
  const _apiPath = apiPath || import.meta.env.VITE_API_PATH;

  // 開頭 render 相關
  const checkLogin = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v2/api/user/check`
      );
      if (!result.data.success) {
        alert("請重新登入");
        setIsAuth(false);
      }
    } catch (error) {
      console.log(error);
      alert("登入失敗，請重新登入");
      setIsAuth(false);
    }
  };
  const getProducts = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/v2/api/${_apiPath}/admin/products/all`
      );
      const { products, success } = result.data;
      if (success) {
        setProducts(Object.values(products));
      }
    } catch (error) {
      console.log(error);
      alert("取得所有商品失敗");
    }
  };

  useEffect(() => {
    checkLogin();
    getProducts();
    new Modal(productModalRef.current, { backdrop: false }); //此參數為按旁邊黑的部分 modal 不會消失
    new Modal(deleteModalRef.current, { backdrop: false });
  }, []);

  // Product Modal相關
  const openProductModal = (mode, productId) => {
    setMode(mode);
    if (mode == "edit") {
      products.forEach((i) => {
        if (i.id == productId) {
          setModalProduct(i);
        }
      });
    } else {
      setModalProduct(defaultProduct);
    }
    Modal.getInstance(productModalRef.current).show();
  };

  const closeProductModal = () => {
    Modal.getInstance(productModalRef.current).hide();
  };

  const modalHandler = (e) => {
    setModalProduct({
      ...modalProduct,
      [e.target.name]:
        e.target.type == "checkbox" ? e.target.checked : e.target.value,
    });
  };

  // 圖片相關
  const imagesHandler = (e, index) => {
    const tempArray = [...modalProduct.imagesUrl];
    tempArray[index] = e.target.value;
    setModalProduct({
      ...modalProduct,
      imagesUrl: tempArray,
    });
  };

  const addImageHandler = () => {
    const tempArray = [...modalProduct.imagesUrl];
    tempArray.push("");
    setModalProduct({
      ...modalProduct,
      imagesUrl: tempArray,
    });
  };

  const removeImageHandler = () => {
    const tempArray = [...modalProduct.imagesUrl];
    tempArray.pop();
    setModalProduct({
      ...modalProduct,
      imagesUrl: tempArray,
    });
  };
  // 新增、編輯按鈕
  const createProduct = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/v2/api/${_apiPath}/admin/product`,
        {
          data: {
            ...modalProduct,
            origin_price: Number(modalProduct.origin_price),
            price: Number(modalProduct.price),
            is_enabled: modalProduct.is_enabled ? 1 : 0,
          },
        }
      );
      if (result.data.success) {
        alert(result.data.message);
        setModalProduct(defaultProduct);
        getProducts();
        closeProductModal();
      }
    } catch (error) {
      console.log(error);
      alert("新增失敗");
      setModalProduct(defaultProduct);
      getProducts();
      closeProductModal();
    }
  };
  const editProduct = async () => {
    try {
      const result = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/v2/api/${_apiPath}/admin/product/${
          modalProduct.id
        }`,
        {
          data: {
            ...modalProduct,
            origin_price: Number(modalProduct.origin_price),
            price: Number(modalProduct.price),
            is_enabled: modalProduct.is_enabled ? 1 : 0,
          },
        }
      );
      if (result.data.success) {
        alert(result.data.message);
        setModalProduct(defaultProduct);
        getProducts();
        closeProductModal();
      }
    } catch (error) {
      console.log(error);
      alert("編輯失敗");
      setModalProduct(defaultProduct);
      getProducts();
      closeProductModal();
    }
  };

  // Delete Modal相關
  const openDeleteModal = (productId) => {
    products.forEach((i) => {
      if (i.id == productId) {
        setDeleteProduct(i);
      }
    });
    Modal.getInstance(deleteModalRef.current).show();
  };

  const closeDeleteModal = () => {
    Modal.getInstance(deleteModalRef.current).hide();
  };

  const deleteModalHandler = async () => {
    try {
      const result = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/v2/api/${_apiPath}/admin/product/${
          deleteProduct.id
        }`
      );
      if (result.data.success) {
        alert(result.data.message);
        setDeleteProduct({});
        getProducts();
        closeDeleteModal();
      }
    } catch (error) {
      console.log(error);
      alert("刪除失敗");
      setDeleteProduct({});
      getProducts();
      closeDeleteModal();
    }
  };

  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  openProductModal("create");
                }}
              >
                建立新的產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            openProductModal("edit", item.id);
                          }}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            openDeleteModal(item.id);
                          }}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* 以下是 Product Modal */}
      <div
        ref={productModalRef}
        id="productModal"
        className="modal"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {mode == "create" ? "新增" : "編輯"}產品
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeProductModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="主圖網址"
                        value={modalProduct.imageUrl}
                        onChange={modalHandler}
                      />
                    </div>
                    <img
                      src={modalProduct.imageUrl}
                      alt=""
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {modalProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          value={image}
                          className="form-control mb-2"
                          onChange={(e) => {
                            imagesHandler(e, index);
                          }}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {modalProduct.imagesUrl.length < 5 &&
                        modalProduct.imagesUrl[
                          modalProduct.imagesUrl.length - 1
                        ] != "" && (
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={addImageHandler}
                          >
                            新增圖片
                          </button>
                        )}
                      {modalProduct.imagesUrl.length > 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={removeImageHandler}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={modalProduct.title}
                      onChange={modalHandler}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={modalProduct.category}
                      onChange={modalHandler}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={modalProduct.unit}
                      onChange={modalHandler}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={modalProduct.origin_price}
                        onChange={modalHandler}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={modalProduct.price}
                        onChange={modalHandler}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      value={modalProduct.description}
                      onChange={modalHandler}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      value={modalProduct.content}
                      onChange={modalHandler}
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      checked={modalProduct.is_enabled}
                      onChange={modalHandler}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeProductModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (mode == "create") {
                    createProduct();
                  } else {
                    editProduct();
                  }
                }}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 以下是 Delete Modal */}
      <div
        ref={deleteModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeDeleteModal}
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{deleteProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteModalHandler}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
