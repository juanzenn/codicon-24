"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { format } from "date-fns";
import { AlbumActions } from "./album-actions";
import { AlbumWithFamilyMembers } from "@/app/(dashboard)/albums/page";
import { FamilyMember } from "@prisma/client";

type AlbumTableProps = {
  albums: AlbumWithFamilyMembers[];
  familyMembers: FamilyMember[];
};

export function AlbumsTable({ albums, familyMembers }: AlbumTableProps) {
  const columns: ColumnDef<AlbumWithFamilyMembers>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{format(row.getValue("date"), "PPP")}</div>,
    },
    {
      id: "id",
      accessorFn: (row) => row,
      size: 20,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <AlbumActions familyMembers={familyMembers} album={row.original} />
      ),
    },
  ];

  return (
    <div className="mx-auto py-10">
      <DataTable columns={columns} data={albums} />
    </div>
  );
}
