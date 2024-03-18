import { useState, useEffect, useRef } from "react";
import { iWindowItem } from '../../interfaces/window_item';
import { useSelector, useDispatch } from "react-redux";
import { iFolder } from '../../interfaces/folder';
import Folder from "../../components/folder";
import styles from "../../styles/global_utils.module.scss";
import { getFromStorage, saveToStorage } from '../../services/webex_api/storage';
import { readAllFoldersFromBrowserAction } from '../../redux/actions/folderCollectionActions';
import ManageFolderPopup from "../../components/utils/manage_folder_popup";
import { clearInEditFolder } from "../../redux/actions/inEditFolderActions";
import { clearMarkedTabsAction, setMarkMultipleTabsAction, setMarkedTabsAction, setTabsSortOrder, setUpTabsAction } from '../../redux/actions/historySettingsActions';
import { setCurrentTabsSortOrder, setUpWindowsAction } from '../../redux/actions/currentSessionActions';
import PrimaryButton from "../../components/utils/primary_button";
import { clearMarkedFoldersAction } from '../../redux/actions/workspaceSettingsActions';
import randomNumber from '../../tools/random_number';
import AddToWorkspacePopup from "../../components/utils/add_to_workspace_popup";
import { iTabItem } from '../../interfaces/tab_item';
import { iFieldOption } from '../../interfaces/dropdown';
import CurrentSessionWindowItem from '../../components/current_session_window_item';
import TextIconButton from '../../components/utils/text_icon_button';
import SortIcon from "../../images/icons/sort_icon";
import Dropdown from "../../components/utils/dropdown";
import TabItem from "../../components/tab_item";
import GenericIconButton from "../../components/utils/generic_icon_button";

function SearchResultsContainer(props:any): JSX.Element {
    const { keyword, onClose } = props;

    const handleClose = (): void => {
        onClose();
    }

    const folderCollection = useSelector((state: any) => state.FolderCollectionReducer);
    const currentSessionSettings = useSelector((state: any) => state.CurrentSessionSettingsReducer);
    const historySettings = useSelector((state: any) => state.HistorySettingsReducer);
    console.log("CCC", currentSessionSettings);
    // Filter currently opened tabs
    function filterCurrentTabs(): Array<chrome.tabs.Tab> {
        let collection: Array<chrome.tabs.Tab> = [];
        currentSessionSettings.windows.forEach((window: chrome.windows.Window) => {
            collection = collection.concat(window.tabs!);
        });

        const result: Array<chrome.tabs.Tab> = collection.filter((tab: chrome.tabs.Tab) => tab.title && tab.title.toLowerCase().includes(keyword.toLowerCase()));
        return result.slice(0,5);
    }

    // Filter previously opened tabs
    function filterHistory(): Array<chrome.history.HistoryItem> {
        const result =  historySettings.tabs.filter((tab: chrome.history.HistoryItem) => tab.title!.toLowerCase().includes(keyword.toLowerCase()));
        return result.slice(0,5);
    }

    function filterFolders(): Array<iFolder> {
        const result =  folderCollection.filter((folder: iFolder) => folder.name.toLowerCase().includes(keyword.toLowerCase()));
        return result.slice(0,5);
    }

    // Close a tab
    function handleCloseTab(tabId: number){
        chrome.tabs.remove(tabId);
    }

    return (
        <>
        {console.log("RERENDER", keyword)}
            <div className="bg-white absolute top-20 z-[200] px-4 w-full">
                <div id="popup-header" className="pb-5 border-tbfColor-lgrey w-full flex justify-between">
                    <h1 data-testid="manage-folder-title" className="text-3xl text-tbfColor-darkpurple font-light inline-block">
                        Search Results
                    </h1>
                    <GenericIconButton icon="close" size={34} fill="rgba(0,0,0,0.2)" onClick={() => handleClose()} />
                </div>
                <div className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">Folders</h3>
                    {filterFolders().map((folder) => <Folder marked={false} id={folder.id!} name={folder.name} viewMode={"list"} type={"collapsed"} desc={folder.desc} windows={folder.windows} />)}
                </div>
                <div className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">Currently opened</h3>
                    {filterCurrentTabs().map((tab) => <TabItem marked={false} id={tab.id!} label={tab.title!} url={tab.url!} disableEdit={true} disableMark={true} disableCloseButton={true} onClose={() => handleCloseTab(tab.id!)} />)}
                </div>
                <div className="mt-4">
                    <h3 className="uppercase font-bold text-md mb-4 text-tbfColor-darkergrey">History</h3>
                    {filterHistory().map((tab) => <TabItem marked={false} id={Number(parseInt(tab.id!))} label={tab.title!} url={tab.url!} disableEdit={true} disableMark={true} disableCloseButton={true} onClose={() => handleCloseTab(parseInt(tab.id!))} />)}
                </div>
            </div>
        </>
    )
}

export default SearchResultsContainer;