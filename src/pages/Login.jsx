import React, { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form, Input } from "antd";

function Login({ setRoles, setToken }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async () => {
    try {
      const resp = await axios.post(
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
      setRoles(resp.data.user.roles);
      setToken(resp.data.accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full ng-gray-100 flex items-center justify-center">
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

        {/* <form onSubmit={handleSubmit}>
          <div className="space-y-2 flex flex-col mb-6">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              className="border p-2"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2 flex flex-col mb-6">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="border p-2"
              placeholder="Enter password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>

          <button className="bg-indigo-500 text-white px-4 py-1 transition hover:bg-indigo-600">
            Login
          </button>
        </form> */}
      </div>
    </div>
  );
}

export default Login;
