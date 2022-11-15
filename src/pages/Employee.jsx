import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, notification } from "antd";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

function Employee() {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [idEdit, setIdEdit] = useState();
  const [validation, setValidation] = useState(false);

  const getAllList = () => {
    axios
      .get("http://localhost:3004/employee?_page=1&_limit=10")
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllList();
  }, []);

  const clearForm = () => {
    setName("")
    setNik("")
  }

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/employee/${id}`);
      getAllList();
      notification.open({
        message: 'Successfully',
        description: 'Your request has been done successfully',
        icon: <CheckCircleOutlined style={{ color: '#73d13d' }} />,
      });
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValidation(false)
    clearForm()
  };

  const handleOk = async (e) => {
    e.preventDefault();
    try {
      if (name == "" || nik == "") {
        setValidation(true)
      } else {
        await axios.post("http://localhost:3004/employee", {
          name,
          nik,
        });
        notification.open({
          message: 'Successfully',
          description: 'Your request has been done successfully',
          icon: <CheckCircleOutlined style={{ color: '#73d13d' }} />,
        });
        clearForm();
        setIsModalOpen(false);
        getAllList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalEdit = (id) => {
    setIsModalOpenEdit(true);

    axios.get(`http://localhost:3004/employee?id=${id}`)
      .then((res) => {
        setName(res.data[0].name)
        setNik(res.data[0].nik)
        setIdEdit(id)
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
    clearForm()
    setValidation(false)
  };

  const handleOkEdit = async (e) => {
    e.preventDefault();
    try {
      if (name == "" || nik == "") {
        setValidation(true)
      } else {
        await axios.put(`http://localhost:3004/employee/${idEdit}`, {
          name,
          nik,
        });
        notification.open({
          message: 'Successfully',
          description: 'Your request has been done successfully',
          icon: <CheckCircleOutlined style={{ color: '#73d13d' }} />,
        });
        clearForm();
        setIsModalOpenEdit(false);
        getAllList();
        setValidation(false)
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <div className="bg-white my-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl m-0">Data Employee</h1>
          <Button type="primary" onClick={showModal}>
            Add
          </Button>
        </div>

        <table className="min-w-max w-full table-auto shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">No</th>
              <th className="p-2">Name</th>
              <th className="p-2">NIK</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((data, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                  key={index}
                >
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {index + 1}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.name}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.nik}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize space-x-2">
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
                  colSpan={4}
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
        title="Add Employee"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form className="space-y-4" onSubmit={handleOk}>
          <div className="space-y-1">
            <label htmlFor="name">Name</label>
            <Input
              required
              placeholder="Enter name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="nik">NIK</label>
            <Input
              required
              placeholder="Enter nik"
              type="number"
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>

          {!validation !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>Name & NIK is required</span>
            </div>
          )}
        </form>
      </Modal>

      <Modal
        title="Edit Employee"
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
      >
        <form className="space-y-4" onSubmit={handleOkEdit}>
          <div className="space-y-1">
            <label htmlFor="name">Name</label>
            <Input
              required
              placeholder="Enter name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="nik">NIK</label>
            <Input
              required
              placeholder="Enter nik"
              type="number"
              id="nik"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>

          {!validation !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>Name & NIK is required</span>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}

export default Employee;
