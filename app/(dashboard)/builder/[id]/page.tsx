import { GetFormById } from "@/actions/form";
import React from "react";
import FormBuilder from "../../../../components/formBuilder";

const BuilderPage = async ({ params }: { params: { id: String } }) => {
  const { id } = params;
  const form = await GetFormById(Number(id));
  if (!form) {
    throw new Error("Form Not Found");
  }

  return <FormBuilder form={form} />;
};

export default BuilderPage;
