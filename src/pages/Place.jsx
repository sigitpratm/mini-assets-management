import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, notification } from "antd";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

function Place() {
  const { TextArea } = Input;
  const [dataPlace, setDataPlace] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [chief, setChief] = useState("");
  const [telp, setTelp] = useState("");
  const [address, setAddress] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [idEdit, setIdEdit] = useState();

  const getAll = () => {
    axios
      .get("http://localhost:3004/place?_page=1&_limit=10")
      .then((resp) => {
        setDataPlace(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAll();
  }, []);

  const clearForm = () => {
    setPlaceName("");
    setChief("");
    setTelp("");
    setAddress("");
  };

  const showModalAdd = () => {
    setModalAddOpen(true);
  };

  const handleCancelAdd = () => {
    setModalAddOpen(false);
    clearForm();
    setIsErr(false);
  };

  const handleOkAdd = async (e) => {
    e.preventDefault();
    try {
      if (placeName == "" || chief == "" || telp == "" || address == "") {
        setIsErr(true);
      } else {
        await axios.post("http://localhost:3004/place", {
          placeName,
          chief,
          telp,
          address,
        });
        notification.open({
          message: "Successfully",
          description: "Your request has been done successfully",
          icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
        });
        setModalAddOpen(false);
        clearForm();
        getAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/place/${id}`);
      notification.open({
        message: "Successfully",
        description: "Your request has been done successfully",
        icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
      });
      getAll();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure ?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk() {
        deleteUser(id);
      },
    });
  };

  const showModalEdit = (id) => {
    setModalEditOpen(true);

    axios
      .get(`http://localhost:3004/place?id=${id}`)
      .then((res) => {
        setIdEdit(id);
        setPlaceName(res.data[0].placeName);
        setAddress(res.data[0].address);
        setChief(res.data[0].chief);
        setTelp(res.data[0].telp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelEdit = () => {
    setModalEditOpen(false);
    clearForm();
    setIsErr(false);
  };

  const handleOkEdit = async (e) => {
    e.preventDefault();
    try {
      if (placeName == "" || chief == "" || telp == "" || address == "") {
        setIsErr(true);
      } else {
        await axios.put(`http://localhost:3004/place/${idEdit}`, {
          placeName,
          chief,
          telp,
          address,
        });
        notification.open({
          message: "Successfully",
          description: "Your request has been done successfully",
          icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
        });
        setModalEditOpen(false);
        clearForm();
        getAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-white my-6 pt-[100px] max-w-6xl container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl m-0">Data Place</h1>
          <Button type="primary" onClick={showModalAdd}>
            Add
          </Button>
        </div>

        <table className="min-w-max w-full table-auto shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">No</th>
              <th className="p-2">Place Name</th>
              <th className="p-2">Chief Officer</th>
              <th className="p-2">No Telp</th>
              <th className="p-2">Address</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {dataPlace.length > 0 ? (
              dataPlace.map((data, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                  key={index}
                >
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {index + 1}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.placeName}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.chief}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.telp}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.address}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    <Button
                      danger
                      type="text"
                      onClick={() => confirmDelete(data.id)}
                      icon={<DeleteFilled />}
                    ></Button>
                    <Button
                      type="text"
                      onClick={() => showModalEdit(data.id)}
                      icon={<EditFilled />}
                    ></Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-200 hover:bg-gray-100 transition">
                <td
                  colSpan={6}
                  className="p-3 whitespace-nowrap text-center capitalize"
                >
                  no data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Add Place"
        open={modalAddOpen}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
      >
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="place">
              <span className="text-red-600">* </span>
              <span>Place Name</span>
            </label>
            <Input
              required
              placeholder="Enter place name"
              type="text"
              id="place"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="chief">
              <span className="text-red-600">* </span>
              <span>Chief Officer</span>
            </label>
            <Input
              required
              placeholder="Enter chief officer"
              type="text"
              id="chief"
              value={chief}
              onChange={(e) => setChief(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="telp">
              <span className="text-red-600">* </span>
              <span>No Telp</span>
            </label>
            <Input
              required
              placeholder="Enter no telp"
              type="number"
              id="telp"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="address">
              <span className="text-red-600">* </span>
              <span>Address</span>
            </label>
            <TextArea
              placeholder="Enter address"
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              rows={4}
            />
          </div>

          {!isErr !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>All field is required</span>
            </div>
          )}
        </form>
      </Modal>

      <Modal
        title="Edit Employee"
        open={modalEditOpen}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
      >
        <form className="space-y-4" onSubmit={handleOkEdit}>
          <div className="space-y-1">
            <label htmlFor="edit-place-name" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Place Name</span>
            </label>
            <Input
              required
              placeholder="Enter place name"
              type="text"
              id="edit-place-name"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-chief" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Chief Officer</span>
            </label>
            <Input
              required
              placeholder="Enter chief officer"
              type="text"
              id="edit-chief"
              value={chief}
              onChange={(e) => setChief(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-telp" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>No Telp</span>
            </label>
            <Input
              required
              placeholder="Enter telp"
              type="text"
              id="edit-telp"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-address" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>No Telp</span>
            </label>
            <TextArea
              rows={4}
              placeholder="Enter address"
              id="edit-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {!isErr !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>All field is required</span>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}

export default Place;
