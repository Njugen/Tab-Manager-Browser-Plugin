import { iFormField } from "../../interfaces/form_field";

/*
    Form field encapsulates other component(s)
    
    Offers a label and a description for the encapsulated component (usually input or textarea, but may
    be something else if necessary).

    If there is an error recorded by the parent component, the label will change to red.
*/
function FormField(props: iFormField): JSX.Element {
    const { label, description, children, error } = props;
    
    return (
        <div className="mb-12 flex flex-row items-center">
            <div className={`w-2/5`}>
                <h4 className={`font-semibold text-lg mb-1 ${error === true && "text-red-500"}`}>{label}</h4>
                <p className={`text-sm leading-6 text-tbfColor-darkergrey text-start ${error === true && "text-red-500"}`}>
                    {description}
                </p>
            </div>
            <div className="w-3/5 ml-24">
                { children }
            </div>
        </div>
    ); 
}

export default FormField;