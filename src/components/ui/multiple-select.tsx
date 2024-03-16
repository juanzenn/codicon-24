"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Option = {
  label: string;
  value: string;
};

type MultipleSelectProps = {
  options: Option[];
};

export function MultipleSelect({ options }: MultipleSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full justify-start" variant="outline">
          Open
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-96">
        {options.map((option) => (
          <DropdownMenuCheckboxItem key={option.value}>
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
