import { AddMember } from "@/components/members/add-member";

export default function MembersPage() {
  return (
    <>
      <header className="mt-10">
        <h1 className="font-bold text-4xl mb-2">Family Members</h1>
        <p>Add the people you care about.</p>
      </header>

      <section className="mt-6">
        <AddMember />
      </section>
    </>
  );
}
