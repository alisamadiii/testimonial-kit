import Content from "@/components/content";
import React from "react";
import SettingsContent from "./content";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Content>
      <SettingsContent id={slug} />
    </Content>
  );
}
