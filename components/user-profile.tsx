import { useState } from "react";

import { useGetUser } from "@/auth/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useDeleteAccount, useLogoutMutation } from "@/auth/useAuth";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserProfile() {
  const { data: user } = useGetUser();
  const { mutate: signOut } = useLogoutMutation();
  const deleteAccount = useDeleteAccount();

  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Avatar>
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>
            {user.name?.charAt(0)}
            {user.name?.charAt(1)}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-2 text-center sm:max-w-80">
        <Avatar className="h-18 w-18">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>
            {user.name?.charAt(0)}
            {user.name?.charAt(1)}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
        </div>
        <Separator className="my-4" />
        <div className="flex w-full flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              signOut(undefined, {
                onSuccess: () => {
                  setOpen(false);
                },
              })
            }
          >
            Logout
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="px-0">
                  <Button
                    variant="destructive"
                    onClick={() => deleteAccount.mutate()}
                    disabled={deleteAccount.isPending}
                  >
                    Delete Account
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
