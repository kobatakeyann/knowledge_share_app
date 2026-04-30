import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AppProvider } from "./contexts/AppContext";
import FeedPage from "./pages/FeedPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";

function App() {
	return (
		<AppProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path="/knowledge_share_app"
						element={<Layout />}
					>
						<Route
							index
							element={<HomePage />}
						/>
						<Route
							path="/knowledge_share_app/feed"
							element={<FeedPage />}
						/>
						<Route
							path="/knowledge_share_app/users"
							element={<UsersPage />}
						/>
						<Route
							path="/knowledge_share_app/profile/:userId"
							element={<ProfilePage />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</AppProvider>
	);
}

export default App;
