import { VStack } from "@chakra-ui/react";
import "./app.css";
import { Routes, Route } from "react-router-dom";
import PublicHeader from "./components/PublicHeader";
import Footer from "./components/Footer";
import PublicLayout from "./components/PublicLayout";
import PostsList from "./components/PostsList";
import SinglePost from "./components/SinglePost";
import CategoryPosts from "./components/CategoryPosts";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./components/Login";
import Register from "./components/Register"


function App() {
  return (
    <div className="App">
      <VStack
        maxWidth={{ base: "100%", "2xl": "80%" }}
        justifyContent="space-between"
        h="100vh"
      >
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route path="/" element={<PostsList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Register />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/category/:name" element={<CategoryPosts />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}></Route>
        </Routes>
      </VStack>
    </div>
  );
}

export default App;
