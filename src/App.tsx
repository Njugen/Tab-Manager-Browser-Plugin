import './App.css';
import "./styles/global_utils.module.scss";
import styles from "./styles/global_utils.module.scss";
import Navlink from './components/utils/navlink';
import { useEffect, useRef, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CollapseIcon from './images/icons/collapse_icon';
import FolderView from './views/folders';
import SettingsView from './views/settings';
import LeftIcon from './images/icons/left_icon';
import RightIcon from './images/icons/right_icon';
import * as predef from "./styles/predef";

function App() {
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [activeNavLink, setActiveNavLink] = useState<string>("options"); 
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const { getAll } = chrome.windows;

  // Routing Start


  // Routing End

  const rootRef = useRef<HTMLDivElement>(null);

  function showScrollUpButton(): void {
    if (rootRef.current?.scrollTop === undefined) return;

    if(rootRef.current?.scrollTop > 0){
      if(showScrollTop === false) setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  }



  function handleScrollButtonClick(): void {
    if (rootRef.current === null || rootRef.current?.scrollTop === undefined) return;
    rootRef.current.scrollTop = 0;
  }

  useEffect(() => {
    rootRef.current?.addEventListener("scroll", showScrollUpButton);
    return () => rootRef.current?.removeEventListener("scroll", showScrollUpButton);
  }, []);

  function handleSidebarExpandButton(): void {
    setSidebarExpanded(sidebarExpanded === true ? false : true);
  }

  const navLinks: Array<JSX.Element> = [
    <Navlink key="folders-nav-link" iconSize={20} label="Workspaces" url="/options" isActive={activeNavLink === "options" ? true : false} onClick={() => setActiveNavLink("options")} />,
    <Navlink key="settings-nav-link" iconSize={20} label="Settings" url="/settings" isActive={activeNavLink === "settings" ? true : false} onClick={() => setActiveNavLink("settings")} />
  ];

  function expandedSidebarNav(): JSX.Element {
    return <>

      <div id="brand-section" className="h-32">

      </div>  
      <div id="main-menu" className="px-4">
        {navLinks.map((link) => link)}
      </div>
    </>;
  }

  function contractedSidebarNav(): JSX.Element {
    return <>

      <div id="brand-section" className="h-32">

      </div>  
      <div id="main-menu" className="flex flex-col items-center justify-center">
        <div className={`my-1 border p-2 rounded-lg ${activeNavLink === "options" && "border-tbfColor-lightpurple"}`}>
          <Navlink key="folders-nav-link" iconSize={32} url="/options" isActive={activeNavLink === "options" ? true : false} onClick={() => setActiveNavLink("options")} />
        </div>
        <div className={`my-1 border p-2 rounded-lg  ${activeNavLink === "settings" && "border-tbfColor-lightpurple"}`}>
          <Navlink key="settings-nav-link" iconSize={32} url="/settings" isActive={activeNavLink === "settings" ? true : false} onClick={() => setActiveNavLink("settings")} />
        </div>
      </div>
    </>;
  }

  function renderViewWrapper(view: JSX.Element): JSX.Element {
    return (<>
          <div className="flex h-screen">
            <div id="sidebar" className={`relative ${styles.sidebar_shadow} ${sidebarExpanded === true ? "min-w-[200px]" : "min-w-[70px]"} transition-all ease-in duration-200  items-end flex flex-col justify-between border-tbfColor-middlegrey bg-white`}>
              <div className="w-full">
                {sidebarExpanded === true ? expandedSidebarNav() : contractedSidebarNav()}
              </div>
              <button className={`flex justify-center items-center bottom-0 right-0 float-right h-6 ${sidebarExpanded === true ? "w-full" : "w-full"} bg-tbfColor-middlegrey2 hover:opacity-70 transition-all ease-in`} onClick={handleSidebarExpandButton}>
                {sidebarExpanded === true ? <LeftIcon size={20} fill="#828282" /> : <RightIcon size={20} fill="#828282" />}
              </button>  
            </div>
            <div ref={rootRef} id="body" className="container w-full overflow-y-scroll scroll-smooth">
              
              <div className="mx-8 my-4">  
                {view}
              </div>
            </div>
          </div>
    </>);
  };

  const router = createBrowserRouter([
    {
      path: "/options",
      element: renderViewWrapper(<FolderView />)
    },
    {
      path: "/settings",
      element: renderViewWrapper(<SettingsView />)
    },  
    {
      path: "/options.html",
      element: renderViewWrapper(<FolderView />)
    },
  ]);

  return (
    <div className="App bg-tbfColor-lightgrey">
       {showScrollTop === true && <button className={`bg-tbfColor-lightpurple hover:bg-tbfColor-darkpurple transition-all ease-in drop-shadow-2xl flex scroll_button_shadow justify-center items-center w-14 h-14 rounded-full absolute bottom-10 right-10 z-[500]`} onClick={handleScrollButtonClick}>
          <CollapseIcon size={40} fill={"#fff"} />
        </button>}
        <div id="root" className={`none:container force_hide_overflow h-screen w-screen`}>
          <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
