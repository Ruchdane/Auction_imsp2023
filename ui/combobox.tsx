"use Client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../utils";
type ComboBoxProps<T> = {
  values: T[];
  index: number | null;
  label: (arg0: T) => string;
  placeholder: string;
  onChange: (index: number, value: T) => void;
};
export function ComboBox<T>(props: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-label={"Chercher " + props.placeholder}
          aria-expanded={open}
          className="flex-1 justify-between w-full border border-dashed mt-1.5"
        >
          {props.index !== null
            ? props.label(props.values[props.index])
            : "Choisisez " + props.placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={"Chercher " + props.placeholder} />
          <CommandEmpty>No presets found.</CommandEmpty>
          <CommandGroup>
            {props.values.map((value, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  props.onChange(index, value);
                  setOpen(false);
                }}
              >
                {props.label(props.values[index])}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    index === props.index ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
