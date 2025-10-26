import { Navigate, useMatch } from "react-router-dom";
import isAuthenticated from "../helper/auth";
import { useEffect, useState, type JSX } from "react";
import { setUser } from "../slices/Auth";
import { useDispatch } from "react-redux";

function LoginAuthGuard({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthentication] = useState(false);
  const isResetPassword = useMatch("/auth/forgotPassword/:token");
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const user = await isAuthenticated();
        dispatch(setUser(user.data));
        let isVerify = user && user.status && user.status == 200 ? true : false;
        setAuthentication(isVerify);
      } catch (error) {
        setAuthentication(false);
      } finally {
        setLoading(false);
      }
    };
    if (!isResetPassword) verifyToken();
    else {
      setAuthentication(false);
      setLoading(false);
    }
  }, []);
  if (loading) {
    return "Loading ....";
  }
  if (authenticated) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}
export default LoginAuthGuard;
