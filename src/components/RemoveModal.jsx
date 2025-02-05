import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

function RemoveModal({
  removeIsOpen,
  setRemoveIsOpen,
  deleteProduct,
  setDeleteProduct,
  defaultProduct,
  getProducts,
  path,
}) {
  const deleteModalRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const closeDeleteModal = () => {
    setRemoveIsOpen(false);
    Modal.getInstance(deleteModalRef.current).hide();
  };

  const deleteModalHandler = async () => {
    try {
      const result = await axios.delete(
        `${BASE_URL}/v2/api/${path}/admin/product/${deleteProduct.id}`
      );
      if (result.data.success) {
        alert(result.data.message);
        setDeleteProduct(defaultProduct);
        getProducts();
        closeDeleteModal();
      }
    } catch (error) {
      console.log(error);
      alert("刪除失敗");
      setDeleteProduct(defaultProduct);
      getProducts();
      closeDeleteModal();
    }
  };

  useEffect(() => {
    if (removeIsOpen) {
      new Modal(deleteModalRef.current, { backdrop: false });
      Modal.getInstance(deleteModalRef.current).show();
    }
  }, [removeIsOpen]);

  return (
    <>
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

export default RemoveModal;
