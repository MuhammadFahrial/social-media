import { createBrowserRouter } from "react-router-dom";
import Home from "pages/home";
import Login from "pages/auth/login";
import Register from "pages/auth/register";
import DetailPosts from "pages/detail/detailPosts";
import Explore from "pages/explore";
import Favorites from "pages/favorites";
import Settings from "pages/settings";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <Home /> },
  { path: "/posts/:id", element: <DetailPosts /> },
  { path: "/explore", element: <Explore /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/settings", element: <Settings /> },
]);

export default router;
