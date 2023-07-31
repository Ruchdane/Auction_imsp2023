import { useLocation } from "react-router-dom";
import ProductCard from "../../feature/product/card";
import { useRedirectUserToLogin } from "../../feature/auth";

export default function MyProducts() {
  const location = useLocation();
  useRedirectUserToLogin(location.pathname);
  return <ProductCard />;
}
