"use client";

import { MemberForm, memberFormSchema } from "@/app/validation/members";
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
import { useCreateMember } from "@/hooks/members";
import { handleReactQueryError, handleZodError } from "@/lib/error";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

export function AddMember() {
  const router = useRouter();
  const { mutate: createMember, isPending: isCreatingMember } =
    useCreateMember();

  const [isPendingTransition, startTransition] = React.useTransition();
  const [form, setForm] = React.useState({
    name: "",
    relationship: "",
    keepAdding: false,
  });
  const [otherOption, setOtherOption] = React.useState("");
  const [open, setOpen] = React.useState(false);

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

  function clearForm() {
    setForm({
      name: "",
      relationship: "",
      keepAdding: false,
    });
    setOtherOption("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Why React?
    event.preventDefault();

    const useOtherOption = form.relationship === "Other";
    const memberBody: MemberForm = {
      name: form.name,
      relationship: useOtherOption ? otherOption : form.relationship,
    };

    const validatedBody = memberFormSchema.safeParse(memberBody);
    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    createMember(validatedBody.data, {
      onSuccess: () => {
        toast({
          variant: "success",
          description: "The family member has been added successfully.",
        });
        startTransition(() => {
          router.refresh();
        });
      },
      onError: handleReactQueryError,
    });

    if (form.keepAdding) {
      clearForm();
    } else {
      // Delay the form clearing to allow a smooth transition
      setTimeout(() => {
        clearForm();
      }, 200);
      setOpen(false);
    }
  }

  const isLoading = isCreatingMember || isPendingTransition;

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
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

        <form className="space-y-6" onSubmit={handleSubmit}>
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
            <div className="flex flex-row-reverse items-center gap-2 text-muted-foreground mr-auto">
              <Label htmlFor="keepAdding">Keep adding members</Label>
              <Checkbox
                className="border-muted-foreground"
                id="keepAdding"
                checked={form.keepAdding}
                onCheckedChange={() => {
                  setForm((prev) => ({
                    ...prev,
                    keepAdding: !prev.keepAdding,
                  }));
                }}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-48 gap-4">
              {isLoading && <Loader2 className="animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
