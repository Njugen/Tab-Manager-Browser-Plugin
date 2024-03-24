import { useRef, useState, useEffect, useLayoutEffect } from "react";
import ClosedFolderIcon from "../images/icons/closed_folder_icon";
import Paragraph from "./utils/paragraph";
import FolderControlButton from "./utils/folder_control_button/folder_control_button";
import OpenedFolderIcon from "../images/icons/opened_folder_icon";
import "../styles/global_utils.module.scss";
import WindowItem from "./window_item";
import { iFolderItem } from "../interfaces/folder_item";
import Checkbox from './utils/checkbox';
import DropdownMenu from "./utils/dropdown_menu/dropdown_menu";
import { iFieldOption } from "../interfaces/dropdown";
import { useSelector } from "react-redux";
import iWorkspaceState from "../interfaces/states/workspaceState";
import { getFromStorage, saveToStorage } from "../services/webex_api/storage";
import TrashIcon from "../images/icons/trash_icon";
import OpenBrowserIcon from "../images/icons/open_browser_icon";
import SettingsIcon from "../images/icons/settings_icon";
import RotationEffect from "./effects/rotation_effect";
import CollapseIcon from "../images/icons/collapse_icon";

/*
    Folder containing description, windows and tabs, as well as various folder options
*/

const FolderItem = (props: iFolderItem): JSX.Element => {
    const contentsRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const folderRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [showLaunchOptions, setShowLaunchOptions] = useState<boolean>(false);
    const [slideDown, setSlideDown] = useState<boolean>(false);

    const workspaceSettings: iWorkspaceState = useSelector((state: any) => state.WorkspaceSettingsReducer);

    // Show a list of options for how to launch this folder
    const handleShowLaunchOptionsMenu = (): void => {
        if(showLaunchOptions === false){
            setShowLaunchOptions(true);
            setTimeout(() => {
                setSlideDown(slideDown === true ? false : true);
            }, 200);
        } else {
            setSlideDown(false);
            setTimeout(() => {
                setShowLaunchOptions(false);
            }, 200);
        }
    }

    const { 
        id,
        name,
        marked,
        desc,
        type,
        viewMode,
        windows,
        index,
        onOpen,
        onMark,
        onDelete,
        onEdit 
    } = props;

    useLayoutEffect(() => {
        toggleExpand(type);
    }, []);

    useEffect(() => {
        // Listen for clicks in the viewport. If the options list is visible, then hide it once
        // anything is clicked
        if(slideDown === true){ 
            window.addEventListener("click", handleWindowClick);
        }
        
        return () => {
            window.removeEventListener("click", handleWindowClick);
        }
    }, [slideDown])

    useEffect(() => {
        if(index && folderRef.current) folderRef.current.style.zIndex = index.toString();
    }, [folderRef])
    
    const exp = (): void => {
        if(contentsRef.current === null || headerRef.current === null) return;

        headerRef.current.className = `relative border-b tbf-${type} bg-white px-4 h-10 py-6 flex items-center rounded-t-md`;
        contentsRef.current.className = "overflow-hidden bg-white rounded-b-md border-t-0";

        setExpanded(true);
    }

    const col = (): void => {
        if(contentsRef.current === null || headerRef.current === null) return;

        headerRef.current.className = `relative tbf-${type} bg-white px-4 h-10 py-6 flex items-center rounded-md`;
        contentsRef.current.className = "overflow-hidden rounded-b-md";
        setExpanded(false);
    }

    const toggleExpand = (init?: string): void => {
        if(expanded === false){
            if(init === "expanded" || !init){
                exp();
            } else {
                col();
            }
        } else {
            col()
        }   
    }

    // Expand or collapse this folder
    const handleExpandClick = (e: any): void => {
        toggleExpand();
    }

    const renderWindows = (): Array<JSX.Element> => {
        const result: Array<JSX.Element> = windows.map((window, index): JSX.Element => (
            <WindowItem 
                tabsCol={workspaceSettings.viewMode === "list" ? 4 : 2} 
                disableTabMark={true} 
                disableTabEdit={true} 
                key={"window-" + index} 
                id={window.id} 
                tabs={window.tabs} 
            />
        ));

        return result;
    }

    // Prepare to open a folder: show launch options -> open folder accordingly
    const handleOpen = (): void => {
        setShowLaunchOptions(true);
        handleShowLaunchOptionsMenu();
    }

    // Launch a folder based on selected option
    const handleLaunch = (id: number): void => {
        let type: string = "";

        if(id === 0){
            type = "normal";
        } else if(id === 1){
            type = "group";
        } else if(id === 2){
            type = "incognito";
        }

        if(onOpen) {
            onOpen(windows, type);
        }

        setShowLaunchOptions(false);
        setSlideDown(false);
    }

   const handleWindowClick = (e: any): void => {
    console.log("heELLO");
        e.stopPropagation();

        if(showLaunchOptions === true){
            setShowLaunchOptions(false);
            setSlideDown(false);
            handleShowLaunchOptionsMenu();
        }
    }

    const handleDelete = (): void => {
        if(onDelete) onDelete(props);
    }

    function handleEdit(e: any): void {
        if(onEdit) onEdit(e);
    } 

    // List of all options on how to launch this folder. The id identifies the option, and
    // actions are performed accordingly.
    const launchOptions: Array<iFieldOption> = [
        {
            id: 0,
            label: "Open"
        },
        {
            id: 1,
            label: "Open as group"
        },
        {
            id: 2,
            label: "Open in incognito"
        }
    ] 

    const renderActionBar = (): JSX.Element => {
        let openButton: JSX.Element | null = null
        let editButton: JSX.Element | null = null
        let deleteButton: JSX.Element | null = null
        let checkbox: JSX.Element | null = null
        let expand_collapse_button: JSX.Element | null = (
            <FolderControlButton id="collapse_expand" active={expanded} onClick={handleExpandClick}>
                <RotationEffect rotated={expanded}>
                    <CollapseIcon size={28} fill={"#000"} />
                </RotationEffect>
            </FolderControlButton>
        );

        if(onOpen){
            openButton = (
                <FolderControlButton id="open_browser" active={expanded} onClick={handleOpen}>
                    <OpenBrowserIcon size={17} fill={"#000"} />
                </FolderControlButton>
            );
        }
        if(onEdit){
            editButton = (
                <FolderControlButton id="settings" active={expanded} onClick={handleEdit}>
                    <SettingsIcon size={17} fill={"#000"} />
                </FolderControlButton>
            );
        }
        if(onDelete){
            deleteButton = (
                <FolderControlButton id="trash" active={expanded} onClick={handleDelete}>
                    <TrashIcon size={17} fill={"#000"} />
                </FolderControlButton>
            );
        }
        if(onMark){
            checkbox = <Checkbox checked={marked} onCallback={(e) => onMark!(id)} />;
        }

        let result = (
            <div className="absolute flex items-center right-4">
                { 
                    showLaunchOptions === true && 
                    <div className={"w-[200px] absolute mt-12 right-10"}>
                        <DropdownMenu 
                            selected={null} 
                            tag={"folder-control-dropdown"} 
                            onSelect={handleLaunch} 
                            options={launchOptions} 
                        />
                    </div>
                }
                {openButton}
                {editButton}
                {deleteButton}
                {expand_collapse_button}
                {checkbox}
            </div>
        );

        return result;
    }

    return (
        <>
            <div 
                ref={folderRef} 
                data-testid={"folder-item"} 
                className={`shadow-[0_0px_3px_1px_rgba(0,0,0,0.125)] ${viewMode === "list" ? "my-4 duration-75" : "my-4 duration-75"} sticky transition-all ease-in w-full rounded-md`}
            >
                <div ref={headerRef}>
                    <div className="inline-block">
                        {expanded === false ? <ClosedFolderIcon size={23} fill={"#000"} /> : <OpenedFolderIcon size={26} fill={"#000"} />}
                    </div>
                    <div className={`inline-block ${viewMode === "list" ? "w-10/12" : "w-5/12"}`}>
                        <h2 className={`text-md p-2 truncate ${expanded === false ? "text-black" : "text-black"}`}>
                            {name}
                        </h2>
                    </div>
                    {renderActionBar()}
                </div>
                <div ref={contentsRef} className="max-h-2000 overflow-y-hidden bg-tbfColor-lighterpurple3">
                {expanded === true && (
                    <>{desc.length > 0 && <div className="px-5 mt-8 flex justify-between items-start">
                    <div data-testid={"description-section"} className="inline-block w-fit">
                            <Paragraph text={desc} />
                        </div>
                    </div>}
                    
                    <div className="px-5 mb-8 mt-8">
                        {[...renderWindows()]}
                    </div></>
                    )}
                </div>
                
            </div>
        </>
    );
}

export default FolderItem;