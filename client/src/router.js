import { createBrowserRouter } from "react-router-dom";
import Home from "./components/views/home";
import Login from "./components/views/login";
import Register from "./components/views/register";
import DetailPosts from "./components/views/detail/detailPosts";

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
