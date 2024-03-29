"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export type Option = {
  label: string;
  value: string;
};

type MultipleSelectProps = {
  options: Option[];
  values: string[];
  onSelect: (id: string) => void;
};

export function MultipleSelect({
  options,
  values,
  onSelect,
}: MultipleSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full justify-start bg-accent hover:bg-accent/50"
          variant="outline"
        >
          <span className="text-wrap text-left line-clamp-1">
            {values
              .map((id) => options.find((option) => option.value === id)?.label)
              .join(", ") || "Select family members"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-96 overflow-x-hidden">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            onCheckedChange={() => {
              onSelect(option.value);
            }}
            checked={values.includes(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
