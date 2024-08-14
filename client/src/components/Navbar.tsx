import { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ContainerInsideNavBar, ContainerOutside } from "./Shared";
import { getToken } from "../utils";
import { RegisterIcon, LoginIcon } from "./Icons";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const chatPage = location.pathname === "/chat";

    if (chatPage && !token) {
      navigate("/login");
    } else if (!chatPage && token) {
      navigate("/chat");
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
    </>
  );
};

export default Navbar;
