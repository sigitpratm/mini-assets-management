import { createContext, useContext, useReducer } from "react";
import { useLocation, Navigate } from "react-router-dom";

/** Store */
const initilaState = { auth: false, role: "" };

const authContext = createContext(initilaState);

export function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { auth: true, role: "" };
    case "logout":
      return { auth: false, role: "" };
    default:
      throw new Error();
  }
}

/**     Auth Provider */
export function AuthProvider({ children }) {
  const [authed, dispatch] = useReducer(reducer, initilaState);

  return (
    <authContext.Provider value={[authed, dispatch]}>
      {children}
    </authContext.Provider>
  );
}

/** Own Auth Consumer Hook */
export default function AuthConsumer() {
  return useContext(authContext);
}

/** Required route  */
export function RequireAuth({ children }) {
  const [authed] = AuthConsumer();
  const location = useLocation();

  return authed.auth === true ? (
    children
  ) : (
    <Navigate
      to={"/login"}
      replace
      state={{ path: location.pathname }}
    ></Navigate>
  );
}
