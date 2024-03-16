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
  },
  {
    id: "2",
    name: "Mommy Doe",
    color: "red",
    ownerId: "1",
    relationship: "Mother",
  },
];

export async function CreateAlbumForm() {
  return (
    <form className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.TITLE}>Title</Label>
        <Input placeholder="Family holidays" />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.TITLE}>Description</Label>
        <Textarea
          rows={5}
          className="resize-none"
          placeholder="Family holidays"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.FAMILY_MEMBERS}>Family members</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select family members" />
          </SelectTrigger>

          <SelectContent>
            {MOCK_MEMBERS.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.DATE}>Date</Label>
        <DatePicker />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create album</Button>
      </div>
    </form>
  );
}
