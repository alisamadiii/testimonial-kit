"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/db/use-projects";
import { Input } from "../ui/input";

export function DeleteProjectAlert({ id }: { id: string }) {
  const [valid, setValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const deleteProject = useDeleteProject();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteProject.mutate(
      { id },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="mt-4">
          Delete Project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild className="md:max-w-sm">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. All data associated with this project
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Type 'delete' to confirm"
            onChange={(e) => setValid(e.target.value === "delete")}
          />
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!valid}>
              Delete
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
