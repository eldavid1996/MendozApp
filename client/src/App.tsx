import "./App.css";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "./components/Shared/Spinner";
import Navbar from "./components/Navbar";
import PageNotFound from "./components/Shared/PageNotFound";

const Login = lazy(() => import("./components/Login"));
const Chat = lazy(() => import("./components/Chat"));
const Register = lazy(() => import("./components/Register"));

const App = () => (
  <>
    <Navbar />
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  </>
);

export default App;
