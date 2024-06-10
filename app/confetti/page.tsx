"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "../../components/ui/use-toast";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Loading from "./loading";

const Confettis = () => {
  const [loading, setLoading] = useState(false);
  let searchParams = new URLSearchParams(window?.location?.search);
  let sharedUrl = searchParams.get("sharedUrl");
  let id = searchParams.get("id");
  useEffect(() => {
      if (sharedUrl && id) {
        console.log("set Value true")
        setLoading(true);
      }  
  }, [loading]);

  // if (!loading) {
  //   return (
  //     <div className="mt-[25rem]">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <>
      {loading && (
        <>
          <Confetti
            width={window?.innerWidth}
            height={window?.innerHeight}
            recycle={false}
            numberOfPieces={1000}
          />
          <div className="flex flex-col items-center justify-center h-full w-full mt-[15rem]">
            <div className="max-w-md">
              <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
                🎊 Form Published 🎊
              </h1>
              <h2 className="text-2xl">Share this form</h2>
              <h3 className="text-xl text-muted-foreground border-b pb-10">
                Anyone with the link can view and submit the form
              </h3>
              <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                <Input
                  className="w-full"
                  readOnly
                  value={sharedUrl ? sharedUrl : ""}
                />
                <Button
                  className="mt-2 w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(sharedUrl ? sharedUrl : "");
                    toast({
                      title: "Copied!",
                      description: "Link copied to clipboard",
                    });
                  }}
                >
                  Copy link
                </Button>
              </div>
              <div className="flex justify-between">
                <Button variant={"link"} asChild>
                  <Link href={"/"} className="gap-2">
                    <BsArrowLeft />
                    Go back home
                  </Link>
                </Button>
                <Button variant={"link"} asChild>
                  <Link href={`/forms/${id ? Number.parseInt(id) : 0}`}>
                    Form details
                    <BsArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Confettis;
