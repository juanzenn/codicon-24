"use client";

import {
  UpdateMemberForm,
  updateMemberFormSchema,
} from "@/app/validation/members";
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
import { useUpdateMember } from "@/hooks/members";
import { handleReactQueryError, handleZodError } from "@/lib/error";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

type UpdateMemberProps = {
  memberId: string;
  memberName: string;
  memberRelationship: string;
  children: React.ReactNode;
};

export function UpdateMember({
  memberId,
  memberName,
  memberRelationship,
  children,
}: UpdateMemberProps) {
  const isOtherOption =
    !FAMILY_MEMBER_RELATIONSHIPS.includes(memberRelationship);

  const router = useRouter();
  const { mutate: updateMember, isPending: isCreatingMember } =
    useUpdateMember();

  const [isPendingTransition, startTransition] = React.useTransition();
  const [form, setForm] = React.useState({
    name: memberName,
    relationship: isOtherOption ? "Other" : memberRelationship,
  });
  const [otherOption, setOtherOption] = React.useState(
    isOtherOption ? memberRelationship : "",
  );
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Why React?
    event.preventDefault();

    const useOtherOption = form.relationship === "Other";
    const memberBody: UpdateMemberForm = {
      name: form.name,
      relationship: useOtherOption ? otherOption : form.relationship,
      id: memberId,
    };

    const validatedBody = updateMemberFormSchema.safeParse(memberBody);
    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    updateMember(validatedBody.data, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Member Update",
          description: "The family member has been updated successfully.",
        });
        startTransition(() => {
          router.refresh();
        });
        setOpen(false);
      },
      onError: handleReactQueryError,
    });
  }

  const isLoading = isCreatingMember || isPendingTransition;

  React.useEffect(() => {
    setForm({
      name: memberName,
      relationship: isOtherOption ? "Other" : memberRelationship,
    });
    setOtherOption(isOtherOption ? memberRelationship : "");
  }, [memberId]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Update Family Member</DialogTitle>
          <DialogDescription>
            Update the details of the family member.
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
              disabled={form.relationship === "Myself"}
              value={form.relationship}
              onValueChange={(value) =>
                handleFormValueChange({
                  target: { name: "relationship", value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {FAMILY_MEMBER_RELATIONSHIPS.map((relationship) => (
                  <SelectItem
                    disabled={relationship === "Myself"}
                    key={relationship}
                    value={relationship}
                  >
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
            <Button type="submit" disabled={isLoading} className="w-48 gap-4">
              {isLoading && <Loader2 className="animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
