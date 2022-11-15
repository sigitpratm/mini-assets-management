import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import Protected from "./Protected";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Assets from "./pages/Assets";
import Employee from "./pages/Employee";
import Place from "./pages/Place";
import Assign from "./pages/Assign";

function setToken(token) {
  sessionStorage.setItem("token", JSON.stringify(token));
}

function getToken() {}

function App() {
  const [token, setToken] = useState();
  const [roles, setRoles] = useState();

  if (!token && !roles) {
    return <Login setToken={setToken} setRoles={setRoles} />;
  }

  return (
    <Router>
      <Header />
      <div className="h-full min-h-[100vh] pt-28 container mx-auto max-w-6xl">
        <Routes>
          <Route path="/" element={<Home />} />{" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/assets" element={<Assets />} />{" "}
          <Route path="/assign" element={<Assign />} />{" "}
          <Route path="/place" element={<Place />} />{" "}
          <Route path="/employee" element={<Employee />} />{" "}
        </Routes>{" "}
      </div>{" "}
    </Router>
  );
}

export default App;
