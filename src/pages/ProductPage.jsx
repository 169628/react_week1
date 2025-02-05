import React, { useState, useEffect } from "react";
import axios from "axios";

import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import RemoveModal from "../components/RemoveModal";

function ProductPage({ setIsAuth, apiPath }) {
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [removeIsOpen, setRemoveIsOpen] = useState(false);
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
  const [page, setPage] = useState({});
  const [modalProduct, setModalProduct] = useState(defaultProduct);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = apiPath || import.meta.env.VITE_API_PATH;

  // 開頭 render 相關
  const checkLogin = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/v2/api/user/check`);
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
  const getProducts = async (page) => {
    try {
      const result = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page || 1}`
      );
      const { products, success, pagination } = result.data;
      if (success) {
        setProducts(products);
        setPage(pagination);
      }
    } catch (error) {
      console.log(error);
      alert("取得所有商品失敗");
    }
  };

  useEffect(() => {
    checkLogin();
    getProducts();
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
    setModalIsOpen(true);
  };

  // Delete Modal相關
  const openDeleteModal = (productId) => {
    products.forEach((i) => {
      if (i.id == productId) {
        setModalProduct(i);
      }
    });
    setRemoveIsOpen(true);
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
      {/* 分頁 */}
      <Pagination page={page} getProducts={getProducts} />
      {/* 以下是 Product Modal */}
      <ProductModal
        mode={mode}
        modalProduct={modalProduct}
        setModalProduct={setModalProduct}
        path={API_PATH}
        getProducts={getProducts}
        defaultProduct={defaultProduct}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      {/* 以下是 Delete Modal */}
      <RemoveModal
        removeIsOpen={removeIsOpen}
        setRemoveIsOpen={setRemoveIsOpen}
        deleteProduct={modalProduct}
        setDeleteProduct={setModalProduct}
        defaultProduct={defaultProduct}
        getProducts={getProducts}
        path={API_PATH}
      />
    </>
  );
}

export default ProductPage;
