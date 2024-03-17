import { useDeleteMember } from "@/hooks/members";
import { FamilyMember } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { UpdateMember } from "./update-member";
import { DeleteModal } from "../DeleteModal";

type Props = {
  member: FamilyMember;
};

export default function MemberActions({ member }: Props) {
  const router = useRouter();

  const { mutateAsync: deleteMember, isPending: deletingMember } = useDeleteMember();

  const [pendingTransition, startTransition] = React.useTransition();

  function handleDeleteMember(memberId: string) {
    return () => deleteMember(memberId, {
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

      <DeleteModal title="Are you sure you want to delete this member?" description="This action is not reversible" disabled={member.relationship === "Myself"} onConfirm={handleDeleteMember(member.id)} />
    </div>
  );
}