"use client";

import React from "react";

import Content from "../content";
import { useGetProjectsById } from "@/db/use-projects";

type Props = {
  slug: string;
};

export default function Dashboard({ slug }: Props) {
  const { data } = useGetProjectsById(slug);

  return (
    <Content>
      <h1 className="text-2xl font-bold">{data?.name}</h1>
    </Content>
  );
}
