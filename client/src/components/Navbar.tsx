import { useEffect, useState, Suspense, lazy } from "react";
import { Button } from "@nextui-org/react";
import {
  Link,
  useLocation,
  useNavigate,
  Route,
  Routes,
} from "react-router-dom";
import Spinner from "./Shared/Spinner";
import { ContainerInsideNavBar, ContainerOutside } from "./Shared";
import PageNotFound from "./Shared/PageNotFound";
import { getToken } from "../utils";
import { RegisterIcon, LoginIcon } from "./Icons";

const Login = lazy(() => import("./Login"));
const Chat = lazy(() => import("./Chat"));
const Register = lazy(() => import("./Register"));

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    const token = getToken();
    const chatPage = location.pathname === "/chat";

    if (chatPage && !token) {
      navigate("/login");
      setShowNotFound(false);
    } else if (!chatPage && token) {
      navigate("/chat");
      setShowNotFound(false);
    } else {
      setShowNotFound(true);
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {!(location.pathname === "/chat") && !getToken() && (
        <ContainerOutside>
          <ContainerInsideNavBar>
            <nav className="flex justify-between gap-1">
              <Button
                as={Link}
                to="/login"
                color="primary"
                variant={
                  location.pathname === "/login" || location.pathname === "/"
                    ? undefined
                    : "flat"
                }
              >
                Iniciar sesión
                <div className="w-auto">
                  <LoginIcon
                    className={
                      location.pathname !== "/login" &&
                      location.pathname !== "/"
                        ? "text-blue-500"
                        : "text-white"
                    }
                  />
                </div>
              </Button>
              <Button
                as={Link}
                to="/register"
                color="primary"
                variant={location.pathname === "/register" ? undefined : "flat"}
              >
                Crear cuenta
                <div className="w-auto">
                  <RegisterIcon
                    className={
                      location.pathname !== "/register"
                        ? "text-blue-500"
                        : "text-white"
                    }
                  />
                </div>
              </Button>
            </nav>
          </ContainerInsideNavBar>
        </ContainerOutside>
      )}
      <Suspense fallback={!(location.pathname === "/chat") && <Spinner />}>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/chat" element={<Chat />}></Route>

          {showNotFound && <Route path="/*" element={<PageNotFound />}></Route>}
        </Routes>
      </Suspense>
    </>
  );
}
