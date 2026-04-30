import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import FeedPage from "./pages/FeedPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile/:userId" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
