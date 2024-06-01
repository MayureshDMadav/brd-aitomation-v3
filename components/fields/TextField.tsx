"use client";

import { MdTextFields } from "react-icons/md";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const type: ElementsType = "TextField";



const extraAttributes = {
    label: "text field",
    helperText: "Helper Text",
    required: false,
    placeHolder: "Value Here",
  }

 
type CustomInstance = FormElementInstance & { extraAttributes: typeof extraAttributes } 

const DesignerComponent = ({
    elementInstance,
  }: {
    elementInstance: FormElementInstance;
  }) => {
    const element = elementInstance as CustomInstance;
    const {label, required , placeHolder ,helperText} = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label>
        {label}
        {required && "*"}   
        </Label>
        <Input readOnly disabled placeholder={placeHolder} />
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
        </div>;
  };
  

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  desginerBtnElement: {
    icon: MdTextFields,
    label: "this is label",
  },
  desginerComponent: DesignerComponent,
  formComponent: () => <div></div>,
  propertiesComponent: () => <div></div>,
};


