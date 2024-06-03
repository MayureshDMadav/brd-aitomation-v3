import { SubtitleFieldFormElement } from "./fields/Subtitle";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";

export type ElementsType = "TextField" | "TitleField" | "Subtitle";

export type SubmitFunction = (key:string,value:string) => void

export type FormElement = {
    type:ElementsType,

    construct : (id:string) => FormElementInstance;

    designerComponent : React.FC<{
        elementInstance : FormElementInstance
    }>;
    formComponent : React.FC<{
        elementInstance : FormElementInstance;
        submitValue?:SubmitFunction;
        isInvalid?: boolean;
        defaultValues?:string;
    }>;
    propertiesComponent: React.FC<{
        elementInstance : FormElementInstance
    }>;

    desginerBtnElement:{
        icon:React.ElementType;
        label:string;
    }

    validate : (formElement:FormElementInstance,currentValue:string)=>boolean;
}


type FormElementType={
    [key in ElementsType]: FormElement;
}

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?:Record<string,any>;
} 

export const FormElements: FormElementType = {
    TextField:TextFieldFormElement,
    TitleField:TitleFieldFormElement,
    Subtitle:SubtitleFieldFormElement
};
