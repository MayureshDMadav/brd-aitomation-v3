"use client";
import React, { useCallback, useRef, useState, useTransition } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "./ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";

const FormSubmitComponent = ({
  formUrl,
  content,
}: {
  content: FormElementInstance[];
  formUrl: string;
}) => {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [renderKey, setRenderkey] = useState(new Date().getTime());
  const [sumitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const pages: FormElementInstance[][] = [];
  let currentPageContent: FormElementInstance[] = [];

  content.forEach((element) => {
    if (element.type === "Seprator") {
      pages.push(currentPageContent);
      currentPageContent = [];
    } else {
      currentPageContent.push(element);
    }
  });

  if (currentPageContent.length > 0) {
    pages.push(currentPageContent);
  }

  const validateForm: () => boolean = useCallback(() => {
    for (const field of pages[currentPage]) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }
    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  }, [pages, currentPage]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderkey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please Check Form For Errors",
        variant: "destructive",
      });
      return;
    }
    try {
      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
    } catch (e) {
      toast({
        title: "Error",
        description: "Something Went Wrong",
        variant: "destructive",
      });
    }
  };

  const progress = ((currentPage + 1) / pages.length) * 100;

  if (sumitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blu-700 rounded">
          <h1 className="text-2xl font-bold">Form Submitted</h1>
          <p className="text-muted-foreground">
            Thank you for Submitting the form, you can close the form
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start flex-col w-full items-center p-8">
      <div className="mb-5 w-[600px] relative">
        <div className="absolute top-0 left-0 w-full bg-gray-200 h-4 rounded-full">
          <div
            className="absolute top-0 left-0 bg-blue-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 mt-[1rem] text-sm text-white-500">
          <span>0%</span>
          <span>{progress.toFixed(0)}%</span>
          <span>100%</span>
        </div>
      </div>
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blu-700 rounded"
      >
        {pages[currentPage].map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValues={formValues.current[element.id]}
            />
          );
        })}
        <div className="flex justify-between">
          {currentPage !== 0 && (
            <Button className="w-[200px]" onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>
              Previous
            </Button>
          )}
          {currentPage !== pages.length - 1 && (
            <Button  className="w-[200px]" onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
              Next
            </Button>
          )}
          {currentPage === pages.length - 1 && (
            <Button
            className="w-[200px]"
              onClick={() => {
                startTransition(submitForm);
              }}
              disabled={pending}
            >
              {!pending ? (
                <>
                  Submit
                  <HiCursorClick className="ml-2" />
                </>
              ) : (
                <ImSpinner2 className="animate-spin" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
