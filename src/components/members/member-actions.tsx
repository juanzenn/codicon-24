import { useDeleteMember } from "@/hooks/members";
import { FamilyMember } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { UpdateMember } from "./update-member";

type Props = {
  member: FamilyMember;
};

export default function MemberActions({ member }: Props) {
  const router = useRouter();

  const { mutate: deleteMember, isPending: deletingMember } = useDeleteMember();

  const [pendingTransition, startTransition] = React.useTransition();

  function handleDeleteMember(memberId: string) {
    if (confirm("Are you sure you want to delete this member?")) {
      deleteMember(memberId, {
        onSuccess: () => {
          startTransition(() => {
            router.refresh();
          });

          toast({
            title: "Member deleted",
            description: `The member "${member.name}" has been deleted.`,
            variant: "success",
          });
        },
      });
    }
  }

  const isLoading = pendingTransition || deletingMember;

  return (
    <div className="text-center space-x-4">
      <UpdateMember
        memberId={member.id}
        memberName={member.name}
        memberRelationship={member.relationship}
      >
        <Button disabled={isLoading} variant="ghost" size="icon">
          <Edit2 size={16} />
        </Button>
      </UpdateMember>

      <Button
        disabled={isLoading}
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteMember(member.id)}
        className="hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
