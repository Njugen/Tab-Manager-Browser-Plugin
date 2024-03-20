import './../App.css';
import "./../styles/global_utils.module.scss";
import styles from "./../styles/global_utils.module.scss";
import Navlink from './../components/utils/navlink';
import { useRef, useState } from 'react';
import DashboardView from './../views/dashboard/dashboard_view';
import SettingsView from '../views/settings/settings_view';
import LeftIcon from './../images/icons/left_icon';
import RightIcon from './../images/icons/right_icon';
import AdvancedSearchBar from '../components/utils/advanced_search_bar';

const RenderOptionsPage = (props: any): JSX.Element => {
  
  // Determine what navigation link (sidebar links) to mark as preset
  const presetActiveNavLink = (): string => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("?");

    if(urlSplit.length === 2){
      const paramSplit: Array<string> =  urlSplit[1].split("=");
      const key: string = paramSplit[0];
      const val: string = paramSplit[1];

      return val;
    } else {
      return "main";
    }
  }

  const [activeNavLink, setActiveNavLink] = useState<string>(presetActiveNavLink()); 
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(localStorage["expanded_sidebar"] === "true" ? true : false);

  const rootRef = useRef<HTMLDivElement>(null);

  // Expand/collapse sidebar, and save the information in the browser storage
  const handleSidebarExpandButton = (): void => {
    setSidebarExpanded(sidebarExpanded === true ? false : true);
    localStorage.setItem("expanded_sidebar", localStorage["expanded_sidebar"] === "true" ? "false" : "true");
  }

  const renderExpandedSidebarNav = (): JSX.Element => {
    return (
      <div id="main-menu" className="px-2 py-4">
          <Navlink key="folders-nav-link" iconSize={20} label="Dashboard" url="?view=main" isActive={activeNavLink === "main" ? true : false} onClick={() => setActiveNavLink("main")} />
          <Navlink key="settings-nav-link" iconSize={20} label="Settings" url="?view=settings" isActive={activeNavLink === "settings" ? true : false} onClick={() => setActiveNavLink("settings")} />
      </div>
    );
  }

  const renderCollapsedSidebarNav = (): JSX.Element => {
    return (
      <div id="main-menu" className="flex flex-col items-center justify-center">
        <div className="">
          <div className={`my-2 border rounded-lg ${activeNavLink === "main" ? "border-tbfColor-lightpurple" : "border-tbfColor-middlegrey2"}`}>
            <Navlink key="folders-nav-link" iconSize={32} url="?view=main" isActive={activeNavLink === "main" ? true : false} onClick={() => setActiveNavLink("main")} />
          </div>
          <div className={`my-2 border rounded-lg ${activeNavLink === "settings" ? "border-tbfColor-lightpurple" : "border-tbfColor-middlegrey2"}`}>
            <Navlink key="settings-nav-link" iconSize={32} url="?view=settings" isActive={activeNavLink === "settings" ? true : false} onClick={() => setActiveNavLink("settings")} />
          </div>
        </div>
      </div>
    );
  }

  // Render the plugin's user interface
  const renderUI = (view: JSX.Element): JSX.Element => {
    return (
      <>       
        <div className="flex h-full w-full relative bg-gray-50">
          <div id="sidebar" className={`drop-shadow-md h-[calc(100vh)] sticky top-0 self-start ${sidebarExpanded === true ? `${styles.sidebar_animation_expanded}` : `${styles.sidebar_animation_contracted}`} overflow-x-hidden items-end flex flex-col justify-between border-tbfColor-middlegrey bg-white`}>
            <div className="w-full px-2 ">
              {sidebarExpanded === true ? renderExpandedSidebarNav() : renderCollapsedSidebarNav()}
            </div>
            <button className={`flex justify-center bottom-0 right-0 float-right h-6 ${sidebarExpanded === true ? "w-full" : "w-full"} bg-tbfColor-middlegrey2 hover:opacity-70 transition-all ease-in`} onClick={handleSidebarExpandButton}>
              {sidebarExpanded === true ? <LeftIcon size={20} fill="#828282" /> : <RightIcon size={20} fill="#828282" />}
            </button>  
          </div>
      
          
          <div ref={rootRef} id="body" className="container px-16">
            <AdvancedSearchBar />
            <div className="mb-12 mt-16 pb-[50px]">
              {view}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Routing. Encapsulate a page component in the renderUI for each path.
  const renderView = (): JSX.Element => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("?");
    let result: JSX.Element = <></>;

    if(urlSplit.length === 1){
      result = renderUI(<DashboardView />);
    } else if(urlSplit.length === 2){
      const paramSplit: Array<string> =  urlSplit[1].split("=");
      const key: string = paramSplit[0];
      const val: string = paramSplit[1]
      
      if(key === "view"){
        if(val === "main"){
          result = renderUI(<DashboardView />);
        } else if(val === "settings"){
          result = renderUI(<SettingsView />);
        } else {
          result = renderUI(<DashboardView />);
        }
        
      } else {
        result = renderUI(<DashboardView />);
      }
    }
    
    return result;
  }

  return renderView();
}

export default RenderOptionsPage;