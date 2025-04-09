"use client";

import { useDeleteApiKey, useGetApiKeys } from "@/db/use-api-keys";
import { Button } from "@/components/ui/button";
import { ApiKey } from "@/db/schema";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export default function Apis() {
  const { data, isPending, error } = useGetApiKeys();

  return (
    <div className="mt-8 flex flex-col gap-4">
      {isPending ? (
        Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))
      ) : error ? (
        <div className="text-red-500">{error.message}</div>
      ) : (
        data?.map((apiKey) => <ApiKeyCard key={apiKey.id} apiKey={apiKey} />)
      )}
    </div>
  );
}

const ApiKeyCard = ({ apiKey }: { apiKey: ApiKey }) => {
  const deleteApiKey = useDeleteApiKey();

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <p>{apiKey.name}</p>
      <p className="text-muted-foreground text-sm">{apiKey.key}</p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={deleteApiKey.isPending}
            className="ml-auto"
            variant="destructive"
          >
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteApiKey.mutate({ id: apiKey.id })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
