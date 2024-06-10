"use client";

import { Button } from "../ui/button";
import { MdPrint } from "react-icons/md";

interface LabelItem {
  id: string;
  label: string;
}

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

const FormData = ({ row, value }: { row: Row | null; value: LabelItem[] }) => {
  if (!row) {
    return null;
  }
  const rowData = Object.entries(row).filter(([key]) => key !== "submittedAt");

  const valueDataMap = new Map(
    value.sort().map((item) => [item.id, item.label])
  );

  const handlePrintCurrentTab = () => {
    window.print();
  };

  return (
    <div>
      <span className="block ml-auto">
        <Button
          variant="outline"
          className="mt-8 flex items-center gap-2"
          id="print_button"
          onClick={handlePrintCurrentTab}
        >
          <MdPrint />
          Print Current
        </Button>
      </span>
      {rowData.map(([key, value]) => (
        <span
          className="mt-8 text-left mb-[-2rem] flex justify-center"
          key={key}
        >
          {" "}
          {valueDataMap &&
          valueDataMap.get(key)?.toLowerCase().trim() === "merchant name" &&
          value.toString() != null
            ? "Merchant Name: " + value.toString()
            : ""}{" "}
        </span>
      ))}
      <div className="grid justify-center mt-10 w-screen" id="download_pdf">
        {rowData.map(([key, value]) => (
          <span key={key}>
            <div className="grid border gap-x-10 gap-y-0 grid-cols-3">
              <div className="p-2">{valueDataMap.get(key)}</div>
              <div className="p-2 w-auto text-center">:</div>
              <div className="p-2 ml-[-9rem]">
                {typeof value === "string" ? value : value?.toString()}
              </div>
            </div>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FormData;
