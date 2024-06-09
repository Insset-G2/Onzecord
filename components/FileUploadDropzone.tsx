"use client";

import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { DropzoneOptions } from "react-dropzone";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { motion } from "framer-motion";
import { Textarea } from "./ui/textarea";

const CardForm = z.object({
  message: z.string(),
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    })
    .nullable(),
});

type CardFormType = z.infer<typeof CardForm>;

const FileUploadDropzone = ({
    placeholder,
    onSubmit,
}: {
    placeholder: string;
    onSubmit: (data: CardFormType) => void;
}) => {
  const form = useForm<CardFormType>({
    resolver: zodResolver(CardForm),
    defaultValues: {
      message: "",
      files: null,
    },
  });

  const dropzone = {
    multiple: true,
    maxFiles: 3,
    maxSize: 4 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const [ showPlaceholder, setShowPlaceholder ] = useState( true );

  return (
    <Form {...form}>
      <form
        onKeyDown={(e) => {
            if( e.key === "Enter" && !e.shiftKey ) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
                form.reset();
            }
        }}
        className="relative w-full grid gap-2"
      >
        <div
          className={`w-full flex items-start rounded-md outline outline-1 outline-border pr-0 p-2 pb-0`}
        >
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropzone}
                  reSelect={true}
                >
                  <FileInput
                    className={cn(
                      buttonVariants({
                        size: "icon",
                      }),
                      "size-8"
                    )}
                  >
                    <Paperclip className="size-4" />
                    <span className="sr-only">Select your files</span>
                  </FileInput>
                  {field.value && field.value.length > 0 && (
                    <FileUploaderContent className="absolute bottom-12 p-2 -ml-3 mb-1 rounded-lg flex-row gap-2 border bg-neutral-800">
                      {field.value.map((file, i) => (
                        <FileUploaderItem
                          key={i}
                          index={i}
                          aria-roledescription={`file ${i + 1} containing ${
                            file.name
                          }`}
                          className="p-0 size-20"
                        >
                          <AspectRatio className="size-full">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="object-cover rounded-md"
                              fill
                            />
                          </AspectRatio>
                        </FileUploaderItem>
                      ))}
                    </FileUploaderContent>
                  )}
                </FileUploader>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="p-0 w-full overflow-hidden relative">
                <Textarea
                  {...field}
                  className={`border focus-visible:ring-0 border-none w-full min-h-[40px] max-h-96`}
                  placeholder={placeholder}
                  onFocus={ () => setShowPlaceholder( false ) }
                  onBlur={ () => setShowPlaceholder( true ) }
                />
                { field.value.length === 0 && showPlaceholder ? (
                    <motion.small
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-neutral-400 absolute left-[10px] -top-[2px] mr-2 text-sm pointer-events-none"
                    >
                        Press { " " }
                        <small className="bg-neutral-800 text-neutral-300 py-0.5 px-1 rounded text-sm font-mono">ctrl k</small>
                        { " " } to open the command palette
                    </motion.small>
                    ) : null
                }
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default FileUploadDropzone;