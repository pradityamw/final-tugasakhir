import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protect = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user?.role !== "admin") {
        navigate("/");
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [user]);
};

export default Protect;
