import "./App.css";
import "./styles/global_utils.module.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OptionsPage from "./baseUI/options_page/options_page";
import SidePanel from "./baseUI/sidepanel/sidepanel";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux-toolkit/store";

/*
  This file acts as the very foundation of this plugin's UI. This file
  connects a collapsable sidebar, a search bar and a page content section into one single unity,
  making it possible to retain all the basic UI elements while changing pages.

  This file also controls the navigation routes using React-Dom.
*/
function App() {
	const router = createBrowserRouter([
		{
			path: "/options.html",
			element: <OptionsPage />
		},
		{
			path: "/sidepanel.html",
			element: <SidePanel />
		}
	]);

	return (
		<div className="App">
			<div id="root" className={`w-full pb`}>
				<RouterProvider router={router} />
			</div>
		</div>
	);
}

export default App;
