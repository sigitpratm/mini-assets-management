import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";

function HomeContent() {
  return (
    <>
      <Header />
      <div>
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default HomeContent;
