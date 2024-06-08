import React, { ReactNode } from "react";
import FormBuilder from "../../../../components/formBuilder";
import Visitbtn from "@/components/Visitbtn";
//import { getFormData } from "./getFormData";
import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../../components/ui/dialog";

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

const RowCell = ({ type, value }: { type: ElementsType; value: string }) => {
  let node: ReactNode = value;
  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckBoxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }
  return <TableCell>{node}</TableCell>;
};

const SubmissonsTable = async ({ id }: { id: number }) => {
  const form = await GetFormWithSubmissions(id);
  if (!form) throw new Error("Form Not Found");
  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  const valueData: {
    id: string;
    label: string;
  }[] = [];

  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);

    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }

    if (element) {
      valueData.push({
        id: element.id,
        label: element.extraAttributes?.label,
      });
    }
  });

  interface LabelItem {
    id: string;
    label: string;
  }

  const FormData = ({
    row,
    value,
  }: {
    row: Row | null;
    value: LabelItem[];
  }) => {
    if (!row) {
      return null; // Return null if row is null or undefined
    }

    const rowData = Object.entries(row).filter(
      ([key]) => key !== "submittedAt"
    );
    const valueDataMap = new Map(value.map((item) => [item.id, item.label]));

    return (
      <>
        <div className="grid justify-center mt-20 w-screen">
          {rowData.map(([key, value]) => (
            <div key={key} className="grid border gap-x-10 gap-y-8 grid-cols-3">
              <div className="p-8">{valueDataMap.get(key)}</div>
              <div className="p-8 w-auto text-center">:</div>
              <div className="p-8 mr-auto">
                {typeof value === "string" ? value : value?.toString()}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold my-4 ml-20 mt-30"> Submissions</h1>
      <div className="rounded-md border w-200 ml-20 mr-20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="uppercase">Merchant Name</TableHead>
              <TableHead className="text-muted-foreground  text-center  uppercase">
                Submitted at
              </TableHead>
              <TableHead className="text-muted-foreground text-right uppercase">
                View Data
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-center">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-muted-foreground  text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"}>View Form</Button>
                    </DialogTrigger>
                    <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0">
                      {row && <FormData row={row} value={valueData} />}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const FormBuilderPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const form = await GetFormById(Number(id));
  if (!form) {
    throw new Error("form not found");
  }

  const { visits, submissions } = form;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10 border-t border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold-truncate">{form.name}</h1>
          <Visitbtn shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total Visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time for Visits"
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Total Submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="Total Number of Form Submitted"
          value={submissions.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="Submissions Rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Total Rate of Form Submission"
          value={submissionRate.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce Rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Number of Form Discarded"
          value={submissionRate.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>
      <div>
        <SubmissonsTable id={form.id} />
      </div>
    </>
  );
};

export default FormBuilderPage;
