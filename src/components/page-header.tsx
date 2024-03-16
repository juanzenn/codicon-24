import React from "react";

type Props = {
  title: string;
  description: string;
};

export default function PageHeader({ description, title }: Props) {
  return (
    <header className="mt-10">
      <h1 className="font-bold text-4xl mb-2">{title}</h1>
      <p>{description}</p>
    </header>
  );
}
