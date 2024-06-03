"use client";
import React, { useContext } from "react";
import { DesginerContext } from "../context/DesignerContext";

const useDesigner = () => {
  const context = useContext(DesginerContext);
  if (!context) {
    throw new Error("User Designer Error");
  }
  return context;
};

export default useDesigner;
