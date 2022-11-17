import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthConsumer from "../hook/auth";

function Header() {
  let navigate = useNavigate();
  const [authed, dispatch] = AuthConsumer();
  const [{ auth }] = AuthConsumer();

  function ActiveLink(props) {
    return (
      <NavLink
        style={({ isActive }) => {
          return {
            color: isActive ? "#60a5fa" : "",
          };
        }}
        {...props}
      />
    );
  }

  return (
    <header className="bg-white w-full border-b border-gray-300 fixed top-0">
      <div className="container mx-auto max-w-6xl py-6 flex justify-between">
        <Link to={"/"} className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 text-blue-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
            />
          </svg>
          <span className="font-semibold text-gray-600 text-xl">TitleSite</span>
        </Link>
        <nav className="flex items-center justify-end gap-8">
          {auth ? (
            <>
              <ActiveLink className="text-gray-500" to={"/assign"}>
                Assign
              </ActiveLink>
              <ActiveLink className="text-gray-500" to={"/assets"}>
                Assets
              </ActiveLink>
              <ActiveLink className="text-gray-500" to={"/employee"}>
                Employee
              </ActiveLink>
              <ActiveLink className="text-gray-500" to={"/place"}>
                Place
              </ActiveLink>
              <button
                className="broder px-5 bg-blue-500 text-gray-50 rounded-md py-1 transition hover:bg-blue-400"
                onClick={() => {
                  dispatch({ type: "logout" });
                  navigate("/login", { replace: true });
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <></>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
