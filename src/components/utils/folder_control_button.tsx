import styles from "./../../styles/global_utils.module.scss";
import { iFolderIconButton } from "../../interfaces/folder_icon_button";
import OpenBrowserIcon from "../../images/icons/open_browser_icon";
import SettingsIcon from "../../images/icons/settings_icon";
import TrashIcon from "../../images/icons/trash_icon";
import ExpandIcon from "../../images/icons/expand_icon";
import CollapseIcon from "../../images/icons/collapse_icon";

function FolderControlButton(props: iFolderIconButton): JSX.Element {
    const { icon, active, onClick } = props;
    
    function renderIcon(): JSX.Element {
        if(icon === "trash"){
            return <TrashIcon size={17} fill={active === false ? "#000" : "#fff"} />;
        } else if(icon === "settings"){
            return <SettingsIcon size={17} fill={active === false ? "#000" : "#fff"} />;
        } else if(icon === "open_browser"){
            return <OpenBrowserIcon size={17} fill={active === false ? "#000" : "#fff"} />;
        } else if(icon === "collapse_expand"){
            if(active === true){
                return <CollapseIcon size={28} fill={"#fff"} />;
            } else if(active === false){
                return <ExpandIcon size={28} fill={"#000"} />;
            }
        }
        return <></>;
    }
    
    return (
        <button className={`${icon !== "collapse_expand" && "mx-2"} ${icon === "collapse_expand" && "ml-3"} ${styles.opacity_hover_effect}`} onClick={onClick}>
            {renderIcon()}
        </button>
    ); 
}

export default FolderControlButton;