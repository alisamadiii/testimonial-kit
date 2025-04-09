"use client";

import React from "react";
import { DeleteProjectAlert } from "@/components/alerts/delete-project";

type Props = {
  id: string;
};

export default function SettingsContent({ id }: Props) {
  return (
    <div>
      <div>
        <h2>Delete Project</h2>
        <p className="text-muted-foreground text-sm">
          This action is irreversible. All data associated with this project
          will be permanently deleted.
        </p>
        <DeleteProjectAlert id={id} />
      </div>
    </div>
  );
}
