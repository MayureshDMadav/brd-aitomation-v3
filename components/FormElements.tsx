import { TextFieldFormElement } from "./fields/TextField";

export type ElementsType = "TextField";

export type FormElement = {
    type:ElementsType,

    construct : (id:string) => FormElementInstance;

    desginerComponent : React.FC<{
        elementInstance : FormElementInstance
    }>;
    formComponent : React.FC;
    propertiesComponent: React.FC<{
        elementInstance : FormElementInstance
    }>;

    desginerBtnElement:{
        icon:React.ElementType;
        label:string;
    }
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
    TextField:TextFieldFormElement
};
