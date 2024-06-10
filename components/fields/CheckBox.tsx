"use client";
import { RadioGroupItem } from "../ui/radio-group";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { toast } from "../ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "../ui/form";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdCheckBox, MdRadioButtonChecked } from "react-icons/md";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import useDesigner from "../hooks/useDesigner";

// Define the properties schema for Checkbox field
const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  options: z.array(z.string()).default([]),
});

// Define the type for properties schema
type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

// Define the extra attributes for radio field
const extraAttributes = {
  label: "Checkbox",
  helperText: "Helper Text",
  required: false,
  options: [],
};

// Define a custom instance type for radio field
type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

// DesignerComponent
const DesignerComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { label, required, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      {/* Render the checkbox options */}
      {element.extraAttributes.options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="checkbox"
            name={element.id}
            value={option}
            id={`${element.id}-${index}`}
            disabled
          />
          <label htmlFor={`${element.id}-${index}`} className="ml-2">
            {option}
          </label>
        </div>
      ))}
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
};
// FormComponent
const FormComponent = ({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValues,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValues?: string;
}) => {
  const element = elementInstance as CustomInstance;
  const [value, setValue] = useState(defaultValues || "");
  const [err, setErr] = useState(false);
  const { label, required, helperText, options } = element.extraAttributes;

  useEffect(() => {
    setErr(isInvalid === true);
  }, [isInvalid]);

  const handleChange = (option: string, checked: boolean) => {
    const newValue = checked
      ? [...value.split(",").filter(Boolean), option].join(",")
      : value
          .split(",")
          .filter(Boolean)
          .filter((v) => v !== option)
          .join(",");
    setValue(newValue);
    if (!submitValue) return;
    const valid = CheckBoxFieldFormElement.validate(element, newValue);
    setErr(!valid);
    submitValue(element.id, newValue);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(err && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      {/* Render the checkbox options */}
      {options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="checkbox"
            name={element.id}
            value={option}
            id={`${element.id}-${index}`}
            checked={value.split(",").includes(option)}
            onChange={(e) => handleChange(option, e.target.checked)}
          />
          <label htmlFor={`${element.id}-${index}`} className="ml-2">
            {option}
          </label>
        </div>
      ))}
      {helperText && (
        <p
          className={cn(
            "text-muted-foreground text-[0.8rem]",
            err && "text-red-500"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
// Define the properties component for radio field
const PropertiesComponent = ({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) => {
  const element = elementInstance as CustomInstance;
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      options: element.extraAttributes.options,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  // Handle Properties Section
  function applyChanges(values: PropertiesSchemaType) {
    const { label, helperText, required, options } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        options,
      },
    });

    toast({
      title: "Success",
      description: "Properties saved successfully",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The HelperText of the field. <br /> It will be displayed above
                the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Options</FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    form.setValue("options", field.value.concat("New Option"));
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch("options").map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = [...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                ))}
              </div>
              <FormDescription>
                The HelperText of the field. <br /> It will be displayed above
                the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>Making Element as Mandatory.</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <Button className="w-full">Save</Button>
      </form>
    </Form>
  );
};

export const CheckBoxFieldFormElement: FormElement = {
  type: "CheckBoxField",
  construct: (id: string) => ({
    id,
    type: "CheckBoxField",
    extraAttributes,
  }),
  desginerBtnElement: {
    icon: MdCheckBox,
    label: "CheckBoxField",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) return currentValue.length > 0;
    return true;
  },
};
