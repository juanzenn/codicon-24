"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAMILY_MEMBER_RELATIONSHIPS } from "@/constants/relationships";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AddMember() {
  const [form, setForm] = React.useState({
    name: "",
    relationship: "",
  });

  const [otherOption, setOtherOption] = React.useState("");

  function handleFormValueChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | {
          target: {
            value: string;
            name: string;
          };
        },
  ) {
    const { name, value } = event.target;

    if (name === "relationship" && value !== "Other") {
      setOtherOption("");
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleChangeOtherOption(event: React.ChangeEvent<HTMLInputElement>) {
    setOtherOption(event.target.value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Family Member</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Add the relevant details of the family member.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleFormValueChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select
              value={form.relationship}
              onValueChange={(value) =>
                handleFormValueChange({
                  target: { name: "relationship", value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Father, Mother..." />
              </SelectTrigger>
              <SelectContent>
                {FAMILY_MEMBER_RELATIONSHIPS.map((relationship) => (
                  <SelectItem key={relationship} value={relationship}>
                    {relationship}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.relationship === "Other" && (
            <div className="grid gap-2">
              <Label htmlFor="otherOption">Other Option</Label>
              <Input
                id="otherOption"
                type="text"
                value={otherOption}
                onChange={handleChangeOtherOption}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
