import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import AuthConsumer from "../hook/auth";
import Cookies from "js-cookie";

function Login() {
  let navigate = useNavigate();
  const [authed, dispatch] = AuthConsumer();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3004/login",
        {
          email: email,
          password: pwd,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(res);
      setErrMsg("");
      dispatch({ type: "login" });
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err.response.data);
      setErrMsg(err.response.data);
    }
  };

  return (
    <div className="w-full ng-gray-100 flex items-center justify-center pt-32">
      <div className="border p-8 w-[32rem] mt-20">
        <p className="text-center text-xl mb-8 pb-4 border-b">LOGIN</p>

        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input onChange={(e) => setEmail(e.target.value)} value={email} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              autoComplete="true"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 20,
            }}
          >
            {errMsg ? <p className="text-red-600">{errMsg}</p> : null}

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
