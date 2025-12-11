import { createBrowserRouter } from "react-router-dom";
import Home from "pages/home";
import Login from "pages/auth/login";
import Register from "pages/auth/register";
import DetailPosts from "pages/detail/detailPosts";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/posts/:id",
    element: <DetailPosts />,
  },
]);

export default router;
