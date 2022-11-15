import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, notification, Select } from "antd";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

function Assets() {
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataEmp, setDataEmp] = useState([]);
  const [isError, setIsError] = useState(false);
  const [assets, setAssets] = useState(false);
  const [idEdit, setIdEdit] = useState();

  const [assetName, setAssetName] = useState("");
  const [type, setType] = useState("");
  const [statusAssets, setStatusAssets] = useState("");
  const [assignTo, setAssignTo] = useState("not assign");
  const [editable, setEditable] = useState(true);

  let typeOption = [
    { value: "general", label: "General" },
    { value: "licences", label: "Licences" },
    { value: "consumable", label: "Consumable" },
  ];

  let statusOption = [
    { value: "deployable", label: "Deployable" },
    { value: "undeployable", label: "Undeployable" },
    { value: "archived", label: "Archived" },
    { value: "pending", label: "Pending" },
  ];

  const getAssets = () => {
    axios
      .get("http://localhost:3004/assets")
      .then((response) => {
        setAssets(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEmp = () => {
    axios
      .get("http://localhost:3004/employee")
      .then((response) => {
        setDataEmp(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let option = [];
  dataEmp.forEach((el) => {
    let x = {
      value: el.id,
      label: el.name,
    };
    option.push(x);
  });

  const clearForm = () => {
    setAssetName("");
    setType("");
    setStatusAssets("");
  };

  useEffect(() => {
    getEmp();
    getAssets();
  }, []);

  const deleteAssets = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/assets/${id}`);
      getAssets();
      notification.open({
        message: "Successfully",
        description: "Your request has been done successfully",
        icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
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
        deleteAssets(id);
      },
    });
  };

  const showModalAdd = () => {
    setModalAdd(true);
  };

  const handleCancelAdd = () => {
    setModalAdd(false);
    setIsError(false);
    clearForm();
  };

  const handleChangeType = (value) => {
    setType(value);
  };

  const handleChangeStatus = (value) => {
    setStatusAssets(value);
  };

  const handleOkAdd = async () => {
    try {
      if (
        assetName == "" ||
        type == "" ||
        statusAssets == "" ||
        assignTo == ""
      ) {
        setIsError(true);
      } else {
        await axios.post("http://localhost:3004/assets", {
          assetName,
          type,
          statusAssets,
          assignTo,
          editable,
        });
        notification.open({
          message: "Successfully",
          description: "Your request has been done successfully",
          icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
        });
        setModalAdd(false);
        setIsError(false);
        clearForm();
        getAssets();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalEdit = (id) => {
    setModalEdit(true);

    axios
      .get(`http://localhost:3004/assets?id=${id}`)
      .then((res) => {
        setIdEdit(id);
        setAssetName(res.data[0].assetName);
        setEditable(res.data[0].editable);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelEdit = () => {
    setModalEdit(false);
    setIsError(false);
  };

  const handleOkEdit = async (e) => {
    e.preventDefault();
    try {
      if (!editable) {
        notification.open({
          message: "Warning",
          description:
            "Can't edit the data, because the asset has been assigned",
          icon: <WarningOutlined style={{ color: "#ffa940" }} />,
        });
        setModalEdit(false);
        getAssets();
        setIsError(false);
      } else {
        if (assetName == "" || type == "" || statusAssets == "") {
          setIsError(true);
        } else {
          await axios.put(`http://localhost:3004/assets/${idEdit}`, {
            assetName,
            type,
            statusAssets,
            assignTo,
            editable,
          });
          notification.open({
            message: "Successfully",
            description: "Your request has been done successfully",
            icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
          });
          setModalEdit(false);
          getAssets();
          clearForm();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleOkEdit = () => {
  //   if (editable) {
  //     if (assetName == "" || type == "" || statusAssets == "") {
  //       setIsError(true);
  //     } else {
  //       axios
  //         .put(`http://localhost:3004/assets/${idEdit}`, {
  //           assetName,
  //           type,
  //           statusAssets,
  //           assignTo,
  //           editable,
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //       notification.open({
  //         message: "Successfully",
  //         description: "Your request has been done successfully",
  //         icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
  //       });
  //       setModalEdit(false);
  //       getAssets();
  //     }
  //   } else {
  //     notification.open({
  //       message: "Warning",
  //       description: "Can't edit the data, because the asset has been assigned",
  //       icon: <WarningOutlined style={{ color: "#ffa940" }} />,
  //     });
  //     setModalEdit(false);
  //     getAssets();
  //   }
  // };

  return (
    <>
      <div className="bg-white my-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl m-0">Data Assets</h1>
          <Button type="primary" onClick={showModalAdd}>
            Add
          </Button>
        </div>

        <table className="min-w-max w-full table-auto shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">No</th>
              <th className="p-2">Asset Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Status Asset</th>
              <th className="p-2">Status Assign</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {assets.length > 0 ? (
              assets.map((data, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                  key={index}
                >
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {index + 1}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.assetName}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.type}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.statusAssets}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.assignTo}
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
                  colSpan={8}
                  className="p-3 whitespace-nowrap text-center capitalize"
                >
                  no data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* modal add assets */}
      <Modal
        title="Add Assets"
        open={modalAdd}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
      >
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="asset-name" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Asset Name</span>
            </label>
            <Input
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
              placeholder="Enter asset name"
              type="text"
              id="asset-name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="type" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Type</span>
            </label>
            <Select
              showSearch
              onChange={handleChangeType}
              style={{ width: "100%" }}
              size={"middle"}
              id="type"
              placeholder="Select type"
              options={typeOption}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="status-asset" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Status Asset</span>
            </label>
            <Select
              showSearch
              onChange={handleChangeStatus}
              style={{ width: "100%" }}
              size={"middle"}
              id="status-asset"
              placeholder="Select status asset"
              options={statusOption}
            />
          </div>

          {!isError !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>All field is required</span>
            </div>
          )}
        </form>
      </Modal>

      {/* modal edit assets */}
      <Modal
        title="Edit Assets"
        open={modalEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
      >
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="edit-asset-name" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Name</span>
            </label>
            <Input
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              required
              placeholder="Enter asset name"
              type="text"
              id="edit-asset-name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-type" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Type</span>
            </label>
            <Select
              showSearch
              onChange={handleChangeType}
              style={{ width: "100%" }}
              placeholder="Select type"
              options={typeOption}
              id="edit-type"
              size={"middle"}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-status-asset" className="space-x-1">
              <span className="text-red-500">*</span>
              <span>Status Asset</span>
            </label>
            <Select
              showSearch
              onChange={handleChangeStatus}
              style={{ width: "100%" }}
              placeholder="Select status asset"
              options={statusOption}
              id="edit-status-asset"
              size={"middle"}
            />
          </div>

          {!isError !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>All field is required</span>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}

export default Assets;
