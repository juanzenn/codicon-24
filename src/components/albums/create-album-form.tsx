"use client";

import { AlbumForm } from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FamilyMember } from "@prisma/client";
import React from "react";
import { MultipleSelect } from "../ui/multiple-select";

const FORM_IDS = {
  TITLE: "title",
  DESCRIPTION: "description",
  FAMILY_MEMBERS: "family-members",
  DATE: "date",
};

const MOCK_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    name: "John Doe",
    color: "red",
    ownerId: "1",
    relationship: "Father",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Mommy Doe",
    color: "red",
    ownerId: "1",
    relationship: "Mother",
    createdAt: new Date(),
  },
];

export function CreateAlbumForm() {
  const [form, setForm] = React.useState<AlbumForm>({
    title: "",
    description: "",
    date: new Date(),
    familyMembers: [],
  });

  function handleChangeInput(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  function handleChangeDate(date?: Date) {
    setForm((prevForm) => ({
      ...prevForm,
      date: date ?? new Date(),
    }));
  }

  function handleToggleFamilyMember(memberId: string) {
    if (form.familyMembers.includes(memberId)) {
      setForm((prevForm) => ({
        ...prevForm,
        familyMembers: prevForm.familyMembers.filter((id) => id !== memberId),
      }));
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      familyMembers: [...prevForm.familyMembers, memberId],
    }));
  }

  async function handleCreateAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Creating album", form);
  }

  console.log(form.familyMembers);

  return (
    <form className="space-y-3" onSubmit={handleCreateAlbum}>
      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.TITLE}>Title</Label>
        <Input
          id={FORM_IDS.TITLE}
          name={FORM_IDS.TITLE}
          placeholder="Family holidays"
          value={form.title}
          onChange={handleChangeInput}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.TITLE}>Description</Label>
        <Textarea
          id={FORM_IDS.DESCRIPTION}
          name={FORM_IDS.DESCRIPTION}
          value={form.description}
          onChange={handleChangeInput}
          rows={5}
          className="resize-none"
          placeholder="Family holidays"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.FAMILY_MEMBERS}>Family members</Label>
        <MultipleSelect
          onSelect={handleToggleFamilyMember}
          values={form.familyMembers}
          options={MOCK_MEMBERS.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.DATE}>Date</Label>
        <DatePicker
          id={FORM_IDS.DATE}
          date={form.date}
          onChange={handleChangeDate}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create album</Button>
      </div>
    </form>
  );
}
