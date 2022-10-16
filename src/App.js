import React, { useEffect, useState, Suspense } from "react";
import { Route, useHistory, Redirect } from "react-router-dom";
import Register from "./pages/register/register";
import ForgetPassword from "./pages/forgetPassword/forgetPassword";
import ResetPassword from "./pages/resetPassword/resetPassword";
// import Dashboard from "./pages/dashboard/dashboard";
import InvitationPage from "./pages/invitation/invitation-page";
import LandingPage from "./pages/landing/landing-page";
import "./App.css";

const Login = React.lazy(() => import("./pages/login/login"));
const Dashboard = React.lazy(() => import("./pages/dashboard/dashboard"));
// const InvitationPage = React.lazy(() => import("./pages/invitation/invitation-page"));
function App() {
  const history = useHistory();
  const [token, setToken] = useState(localStorage.getItem("token"));
  // console.log("VERSION 1.22.02 ===========");

  useEffect(() => {
    if (
      history.location.pathname.startsWith("/api/password/reset/confirm") ||
      history.location.pathname.startsWith("/password/reset/confirm")
    ) {
      localStorage.clear();
      history.push("/password/reset/confirm" + history.location.search);
    } else if (history.location.pathname.startsWith("/landing")) {
      history.push(history.location.pathname + history.location.search);
    } else if (history.location.pathname.startsWith("/invitation")) {
      history.push(history.location.pathname + history.location.search);
    } else if (history.location.pathname.startsWith("/dashboard/payment/")) {
      history.push(history.location.pathname + history.location.search);
    } else {
      if (!token) {
        history.push("/login");
      } else {
        history.push("/dashboard");
      }
    }
  }, [token]);

  return (
    <Suspense fallback={<div></div>}>
      <Route exact path="/login" component={() => <Login />} />
      <Route exact path="/register" component={() => <Register />} />
      <Route exact path="/forget" component={() => <ForgetPassword />} />
      <Route path="/dashboard" component={() => <Dashboard />} />
      <Route
        exact
        path="/password/reset/confirm"
        component={() => <ResetPassword />}
      />
      <Route exact path="/landing" component={() => <LandingPage />} />
      <Route path="/invitation" component={() => <InvitationPage />} />
      <Route exact path="/">
        {token ? <Redirect to="/login" /> : <Login />}
      </Route>
    </Suspense>
  );
}

export default App;
