"use client";

import { ReactNode, createContext, useState } from "react";
import { FormElementInstance } from "../FormElements";





type DesignerContextType = {
    elements: FormElementInstance[];
    addElement: (index: number, element:FormElementInstance) => void;
    removeElement: (id:string) => void
};

export const DesginerContext = createContext<DesignerContextType | null>(null);




export default function DesignerContextProvider({
    children
}:{
    children:ReactNode;
}){
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const addElement = (index:number, element: FormElementInstance) =>{
        setElements((prev) =>{
         const newElement = [...prev];
         newElement.splice(index,0,element);
         return newElement;   
        })
    }


    const removeElement = (id:string) =>{
        setElements((prev) => prev.filter((element) => element.id !== id));
    }

    return <DesginerContext.Provider value={{
        elements,
        addElement,
        removeElement
    }} >{children}</DesginerContext.Provider>
}

