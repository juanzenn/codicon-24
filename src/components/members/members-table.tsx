"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FamilyMember } from "@prisma/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { DataTable } from "../ui/data-table";
import MemberActions from "./member-actions";

type MembersTableProps = {
  members: FamilyMember[];
};

const columns: ColumnDef<FamilyMember>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "relationship", header: "Relationship" },
  {
    id: "id",
    accessorFn: (row) => row,
    size: 20,
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      return <MemberActions member={row.original} />;
    },
  },
];

export default function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="mx-auto py-10">
      <DataTable columns={columns} data={members} />
    </div>
  );
}
