import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { FRAMEWORKS } from "@/lib/data";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploaderProps } from "./FileUploader";

type Framework = Record<"value" | "label", string>;

export function FancyMultiSelect({onUploadSuccess}:UploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>([FRAMEWORKS[1]]);
  const [inputValue, setInputValue] = React.useState("");
  const { toast } = useToast();
  const handleUnselect = React.useCallback((framework: Framework) => {
    setSelected((prev) => prev.filter((s) => s.value !== framework.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = FRAMEWORKS.filter(
    (framework) => !selected.includes(framework)
  );

  const handleSubmit = async () =>{
   try {
    console.log("selected : " , selected)
    const res = await axios.post(`${BACKEND_URL}/api/v1/form-dropdown` , selected )
    toast({
      title: "Success",
      description: "Form Submitted Successfully",
      variant:"newVariant"
    })
    onUploadSuccess(true);
    console.log(res)
   } catch (error) {
     console.log(error)
     toast({
       title: "Error",
       variant: "destructive",
       description: "Something went wrong",
     })
     onUploadSuccess(false);
   }     
  }

  return (
      <div>
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
        <div className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select frameworks..."
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((framework) => {
            return (
              <Badge key={framework.value} variant="secondary" 
              className="m-5">
                {framework.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(framework);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(framework)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
        </div>
        <div className="relative mt-2">
          <CommandList>
            {open && selectables.length > 0 ? (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((framework) => {
                    return (
                      <CommandItem
                        key={framework.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          setInputValue("");
                          setSelected((prev) => [...prev, framework]);
                        }}
                        className={"cursor-pointer"}
                      >
                        {framework.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ) : null}
          </CommandList>
        </div>
      </Command>
      {selected.length > 0 && <Button className="absolute bottom-[93px] mr-8 text-center right-40 w-[136px]" onClick={handleSubmit}>Submit</Button>}
    </div>
  );
}
