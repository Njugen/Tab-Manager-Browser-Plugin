import { forwardRef, useEffect } from "react"
import CloseIcon from "../icons/close_icon"
import { innerStyleDirection, outerStyleDirection } from "../features/folder_manager/functions/style_directions"
import GenericIconButton from "./generic_icon_button"
import PrimaryButton from "./primary_button/primary_button"
import PurpleBorderButton from "./purple_border_button"
import { iGenericPopup } from '../../interfaces/generic_popup';
import styles from "../../styles/global_utils.module.scss";

// Popup component with providing basic popup features.
// Can encapsulate any components and trigger callback props for when
// clicking primary/secondary buttons (e.g. save and close)

const GenericPopup = forwardRef(function GenericPopup(props: iGenericPopup, ref: any): JSX.Element {
    const { title, type, children, show, save, cancel } = props;

    const handleClose = (): void => {
        cancel.handler();
    }

    const handleSave = (): void => {
        if(!save) return;
        save?.handler();
    }

    return (
        <div data-testid="generic-popup" ref={ref} className={`${styles.scroll_style} overflow-y-scroll ${outerStyleDirection(type, show)}`}>
            <div className="relative top-0 md:bottom-12 h-screen w-[992px]">
                <div className={innerStyleDirection(type, show)}>
                    <div id="generic-popup-header" className={`pl-8 pr-5 pb-5 pt-6 border-b border-tbfColor-lgrey w-full flex justify-between`}>
                        <h1 data-testid="generic-popup-title" className="text-3xl text-tbfColor-darkpurple font-light inline-block">
                            {title}
                        </h1>
                        <GenericIconButton icon="close" onClick={handleClose}>
                            <CloseIcon size={34} fill="rgba(0,0,0,0.2)" />
                        </GenericIconButton>
                    </div>
                    <div id="generic-popup-body" className="px-8 pt-6">
                        {children}
                    </div>
                    {
                        save && (
                            <div data-testid="generic-popup-footer" className="max-sm:justify-center px-8 py-8 mt-4 flex justify-end border-t border-tbfColor-lgrey s">
                                <PurpleBorderButton disabled={false} text={cancel.label} onClick={handleClose} />
                                <PrimaryButton disabled={false} text={save.label} onClick={handleSave} />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
})

export default GenericPopup;