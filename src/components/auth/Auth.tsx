import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserRegistration from "./userRegistration";
import { useEffect } from "react";
import ResetPasswordEmailInput from "./resetPasswordEmailInput";
import ResetPassword from "./resetPassword";
function Auth() {

  return (
    <div className="row">
      <div className="col-md-4">&nbsp;</div>
      <div className="col-md-4 mt-2">
        <Routes>
          <Route path="/" element={<Navigate to="authenticate" />}></Route>
          <Route
            path="authenticate"
            element={<UserRegistration/>}
          ></Route>
          <Route
            path="resetPassword"
            element={<ResetPasswordEmailInput />}
          ></Route>
          <Route
            path="forgotPassword/:token"
            element={<ResetPassword />}
          ></Route>
        </Routes>
      </div>
      <div className="col-md-4">&nbsp;</div>
    </div>
  );
}

export default Auth;
