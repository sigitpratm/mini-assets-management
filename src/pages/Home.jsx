import React from "react";
import AuthConsumer from "../hook/auth";

function Home() {
  let auth = AuthConsumer();

  return (
    <>
      <div className="container mx-auto pt-[100px] max-w-6xl ">
        <p className="text-xl text-center">
          Assets Management System (Mini Project)
        </p>
      </div>
    </>
  );
}

export default Home;
