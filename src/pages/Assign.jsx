import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, notification, Radio, Select, Tooltip } from "antd";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";

function Assign() {
  const [modalAssign, setModalAssign] = useState(false);
  const [modalCheckin, setModalCheckin] = useState(false);
  const [modalCheckout, setModalCheckout] = useState(false);

  const [typeAssign, setTypeAssign] = useState("");
  const [dataEmp, setDataEmp] = useState([]);
  const [dataPlace, setDataPlace] = useState([]);
  const [dataAssets, setDataAssets] = useState([]);
  const [dataAssign, setDataAssign] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState();
  const [assignName, setAssignName] = useState("");

  const [idAsset, setIdAsset] = useState("");
  const [idAssignTo, setIdAssignTo] = useState("");
  const [statusAssign, setStatusAssign] = useState("check-out");
  const [validation, setValidation] = useState(false);

  const [assetName, setAssetName] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [editable, setEditable] = useState("");
  const [statusAssets, setStatusAssets] = useState("");
  const [type, setType] = useState("");

  // checkin
  const [statusAssetCheckin, setStatusAssetCheckin] = useState();
  const [updtAssetName, setUpdtAssetName] = useState("");
  const [updtType, setUpdtType] = useState("");
  const [updtStatusAssets, setUpdtStatusAssets] = useState("");
  const [updtAssignTo, setUpdtAssignTo] = useState("");
  const [updtEditable, setUpdtEditable] = useState("");
  const [idCheckIn, setIdCheckIn] = useState("");

  // checkout
  const [checkoutIdAsset, setCheckoutIdAsset] = useState();
  const [checkoutIdAssign, setCheckoutIdAssign] = useState();

  let statusOption = [
    { value: "deployable", label: "Ready to deploy (deployable)" },
    { value: "undeployable", label: "Broken (undeployable)" },
    { value: "archived", label: "Lost/stolen (archived)" },
    { value: "repair", label: "Repair (undeployable)" },
  ];

  const getAllAssign = async () => {
    await axios
      .get("http://localhost:3004/assign")
      .then((response) => {
        setDataAssign(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getName = (id, type) => {
    if (type === "employee") {
      axios
        .get(`http://localhost:3004/employee/${id}`)
        .then((response) => {
          setAssignName(response.data.name);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "place") {
      axios
        .get(`http://localhost:3004/place/${id}`)
        .then((response) => {
          setAssignName(response.data.placeName);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`http://localhost:3004/assets/${id}`)
        .then((response) => {
          setSelectedAsset(response.data.assetName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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

  const getPlace = () => {
    axios
      .get("http://localhost:3004/place")
      .then((response) => {
        setDataPlace(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAssets = async () => {
    try {
      await axios
        .get(
          "http://localhost:3004/assets?assignTo=not+assign&statusAssets=deployable"
        )
        .then((response) => {
          setDataAssets(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  let optEmp = [];
  dataEmp.forEach((el) => {
    let x = {
      value: el.id,
      label: el.name,
    };
    optEmp.push(x);
  });

  let optPlace = [];
  dataPlace.forEach((el) => {
    let x = {
      value: el.id,
      label: el.placeName,
    };
    optPlace.push(x);
  });

  let optAssets = [];
  dataAssets.forEach((el) => {
    let x = {
      value: el.id,
      label: el.assetName,
    };
    optAssets.push(x);
  });

  const handleChangeAssignTo = (id) => {
    setIdAssignTo(id);
    getName(id, typeAssign);
  };

  function getUsedAsset(id) {
    axios
      .get(`http://localhost:3004/assets/${id}`)
      .then((response) => {
        setAssetName(response.data.assetName);
        setAssignTo("assign");
        setEditable(false);
        setStatusAssets(response.data.statusAssets);
        setType(response.data.type);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleChangeAsset = (id) => {
    setIdAsset(id);
    getName(id);
    getUsedAsset(id);
  };

  const handleRadio = (e) => {
    setTypeAssign(e.target.value);
  };

  const clearForm = () => {};

  const showModalAssign = () => {
    setModalAssign(true);
  };

  const handleCancelAdd = () => {
    setModalAssign(false);
    clearForm();
    setValidation(false);
  };

  const handleOkAdd = (e) => {
    e.preventDefault();

    if (selectedAsset == "" || typeAssign == "" || idAssignTo == "") {
      setValidation(true);
    } else {
      Promise.all([
        axios.post("http://localhost:3004/assign", {
          selectedAsset,
          typeAssign,
          assignName,
          idAsset,
          idAssignTo,
          statusAssign,
        }),

        axios.put(`http://localhost:3004/assets/${idAsset}`, {
          assetName,
          assignTo,
          editable,
          statusAssets,
          type,
        }),
      ]).then((response) => {
        const assign = response[0].data;
        const assets = response[1].data;

        notification.open({
          message: "Successfully",
          description: "Your request has been done successfully",
          icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
        });
        setModalAssign(false);
        getAllAssign();
        setValidation(false);
      });
    }
  };

  /** CHECK-IN */
  const showModalCheckin = (id) => {
    setModalCheckin(true);
    setIdCheckIn(id);
    setStatusAssign("");
    setStatusAssetCheckin("");

    axios
      .get(`http://localhost:3004/assign?id=${id}`)
      .then((res) => {
        const assign = res.data[0];
        setAssignName(assign.assignName);
        setIdAsset(assign.idAsset);
        setIdAssignTo(assign.idAssignTo);
        setSelectedAsset(assign.selectedAsset);
        setTypeAssign(assign.typeAssign);
        setStatusAssign("check-in");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelCheckin = () => {
    setModalCheckin(false);
    setValidation(false);
  };

  const handleStatusCheckin = (value) => {
    setStatusAssetCheckin(value);

    axios
      .get(`http://localhost:3004/assets/${idAsset}`)
      .then((res) => {
        setUpdtAssetName(res.data.assetName);
        setUpdtAssignTo("not assign");
        setUpdtEditable(true);
        setUpdtStatusAssets(value);
        setUpdtType(res.data.type);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOkCheckin = (e) => {
    e.preventDefault();

    if (statusAssetCheckin == "") {
      setValidation(true);
    } else {
      Promise.all([
        axios.put(`http://localhost:3004/assign/${idCheckIn}`, {
          assignName,
          idAsset,
          idAssignTo,
          selectedAsset,
          statusAssign,
          typeAssign,
        }),

        axios.put(`http://localhost:3004/assets/${idAsset}`, {
          assetName: updtAssetName,
          type: updtType,
          statusAssets: updtStatusAssets,
          assignTo: updtAssignTo,
          editable: updtEditable,
        }),
      ])
        .then((res) => {
          const assign = res[0].data;
          const assets = res[1].data;

          notification.open({
            message: "Successfully",
            description: "Your request has been done successfully",
            icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
          });

          setModalCheckin(false);
          getAllAssign();
          setValidation(false);
          getAssets();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  /** CHECK-OUT */
  const handleChangeAssetCo = (id) => {
    setIdAsset(id);
    getName(id);
    getUsedAsset(id);
    axios
      .get(`http://localhost:3004/assets/${id}`)
      .then((res) => {
        setAssetName(res.data.assetName);
        setAssignTo("assign");
        setStatusAssets(res.data.statusAssets);
        setEditable(res.data.editable);
        setType(res.data.type);
        setCheckoutIdAsset(res.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showModalCheckout = (id) => {
    setModalCheckout(true);

    axios
      .get(`http://localhost:3004/assign/${id}`)
      .then((res) => {
        setCheckoutIdAssign(res.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelCheckout = () => {
    setModalCheckout(false);
    setValidation(false);
  };

  const handleOkCheckout = (e) => {
    e.preventDefault();

    if (selectedAsset == "" || typeAssign == "" || idAssignTo == "") {
      setValidation(true);
    } else {
      Promise.all([
        axios.put(`http://localhost:3004/assign/${checkoutIdAssign}`, {
          selectedAsset,
          typeAssign,
          assignName,
          idAsset,
          idAssignTo,
          statusAssign,
        }),

        axios.put(`http://localhost:3004/assets/${checkoutIdAsset}`, {
          assetName,
          assignTo,
          statusAssets,
          editable,
          type,
        }),
      ])
        .then((res) => {
          const assign = res[0].data;
          const asset = res[1].data;

          notification.open({
            message: "Successfully",
            description: "Your request has been done successfully",
            icon: <CheckCircleOutlined style={{ color: "#73d13d" }} />,
          });

          setModalCheckout(false);
          setValidation(false);
          getAllAssign();
          getAssets();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getAllAssign();
    getEmp();
    getPlace();
    getAssets();
  }, []);

  return (
    <>
      <div className="bg-white my-6 pt-[100px] max-w-6xl container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl m-0">Data Assign</h1>
          <Button type="primary" onClick={showModalAssign}>
            Add
          </Button>
        </div>

        <table className="min-w-max w-full table-auto shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">No</th>
              <th className="p-2">Asset Name</th>
              <th className="p-2">Assign Status</th>
              <th className="p-2">Assign Type</th>
              <th className="p-2">Assign To</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {dataAssign.length > 0 ? (
              dataAssign.map((data, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                  key={index}
                >
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {index + 1}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.selectedAsset}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.statusAssign}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.typeAssign}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize">
                    {data.assignName}
                  </td>
                  <td className="p-3 whitespace-nowrap text-center capitalize flex items-center justify-center">
                    {data.statusAssign == "check-out" ? (
                      <Button
                        onClick={() => showModalCheckin(data.id)}
                        type="text"
                        icon={<DownloadOutlined />}
                        style={{
                          color: "#73d13d",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Checkin
                      </Button>
                    ) : null}

                    {data.statusAssign == "check-in" ? (
                      <Button
                        onClick={() => showModalCheckout(data.id)}
                        type="text"
                        icon={<UploadOutlined />}
                        style={{
                          color: "#ffa940",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Checkout
                      </Button>
                    ) : null}
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

      {/* modal add assign */}
      <Modal
        title="Add Assign"
        open={modalAssign}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
      >
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="data-emp">
              <span className="text-red-600">* </span>
              <span>Select Asset</span>
            </label>

            <Select
              placeholder="Select Assets"
              size="middle"
              style={{
                width: "100%",
              }}
              onChange={handleChangeAsset}
              options={optAssets}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="place">
              <span className="text-red-600">* </span>
              <span>Assign Type</span>
            </label>

            <div className="flex gap-8">
              <Radio.Group onChange={handleRadio}>
                <Radio.Button value="employee">Employee</Radio.Button>
                <Radio.Button value="place">Place</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="data-emp">
              <span className="text-red-600">* </span>
              <span>Assign To</span>
            </label>
            {typeAssign === "employee" ? (
              <div>
                <Select
                  placeholder="Select Employee"
                  size="middle"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeAssignTo}
                  options={optEmp}
                />
              </div>
            ) : null}

            {typeAssign === "place" ? (
              <div>
                <Select
                  placeholder="Select Place"
                  size="middle"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeAssignTo}
                  options={optPlace}
                />
              </div>
            ) : null}
          </div>

          {!validation !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>All field is required</span>
            </div>
          )}
        </form>
      </Modal>

      {/* modal checkin */}
      <Modal
        title="Checkin Asset"
        open={modalCheckin}
        onOk={handleOkCheckin}
        onCancel={handleCancelCheckin}
      >
        <div className="space-y-1">
          <label htmlFor="status-checkin">
            <span className="text-red-600">* </span>
            <span>Update Status Assets</span>
          </label>
          <Select
            id="status-checkin"
            onChange={handleStatusCheckin}
            style={{ width: "100%" }}
            placeholder="Select status asset"
            options={statusOption}
            size={"middle"}
          />

          {!validation !== true && (
            <div className="space-y-1 text-red-600 font-semibold mt-4">
              <span>Please select status</span>
            </div>
          )}
        </div>
      </Modal>

      {/* modal checkout */}
      <Modal
        title="Checkout Asset"
        open={modalCheckout}
        onCancel={handleCancelCheckout}
        onOk={handleOkCheckout}
      >
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="out-select-asset">
              <span className="text-red-600">* </span>
              <span>Select Asset</span>
            </label>
            <Select
              onChange={handleChangeAssetCo}
              id="out-select-asset"
              placeholder="Select Assets"
              size="middle"
              style={{
                width: "100%",
              }}
              options={optAssets}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="out-assign-type">
              <span className="text-red-600">* </span>
              <span>Assign Type</span>
            </label>
            <div className="flex gap-8">
              <Radio.Group onChange={handleRadio}>
                <Radio.Button value="employee">Employee</Radio.Button>
                <Radio.Button value="place">Place</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="data-emp">
              <span className="text-red-600">* </span>
              <span>Assign To</span>
            </label>
            {typeAssign === "employee" ? (
              <div>
                <Select
                  placeholder="Select Employee"
                  size="middle"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeAssignTo}
                  options={optEmp}
                />
              </div>
            ) : null}

            {typeAssign === "place" ? (
              <div>
                <Select
                  placeholder="Select Place"
                  size="middle"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeAssignTo}
                  options={optPlace}
                />
              </div>
            ) : null}
          </div>

          {!validation !== true && (
            <div className="space-y-1 text-red-600 font-semibold">
              <span>All field is required</span>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}

export default Assign;
