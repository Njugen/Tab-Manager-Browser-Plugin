import DashboardView from "../../../views/dashboard/dashboard_view";
import SettingsView from "../../../views/settings/settings_view";
import iPageView from "../../../interfaces/page_view";
import { useEffect } from "react";

const PageView = (props: iPageView): JSX.Element => {
    const url: string = window.location.href;
    const urlSplit: Array<string> = url.split("?");
    let result: JSX.Element = <></>;
    
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }, [url])

    if(urlSplit.length === 1){
      result = <DashboardView data-testid="ffff" />;
    } else if(urlSplit.length === 2){
      const paramSplit: Array<string> =  urlSplit[1].split("=");
      const key: string = paramSplit[0];
      const val: string = paramSplit[1]
      
      if(key === "view"){
        if(val === "main"){
          result = <DashboardView />
        } else if(val === "settings"){
          result = <SettingsView />;
        } else {
          result = <DashboardView />;
        }
        
      } else {
        result = <DashboardView />;
      }
    }

    return result;
}

export default PageView;