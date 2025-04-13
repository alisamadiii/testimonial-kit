"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

import { useGetProjectsById, useUpdateProject } from "@/db/use-projects";
import { Button } from "@/components/ui/button";
import { authProviders } from "@/lib";
import { Switch } from "@/components/ui/switch";
import { checkEnvVariables } from "@/db/action";

type Props = {
  slug: string;
};

export default function AuthContent({ slug }: Props) {
  const project = useGetProjectsById(slug);
  const updateProject = useUpdateProject(slug);

  if (project.isPending) return <div>Loading...</div>;
  if (project.isError) return <div>Error: {project.error.message}</div>;

  if (project.data?.authsEnabled === false) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Require Authentication</h1>
        <p className="text-muted-foreground">
          Enable authentication for your project, so only authenticated users
          can submit testimonials.
        </p>
        <Button
          onClick={() =>
            updateProject.mutate({
              values: { authsEnabled: true },
            })
          }
          disabled={updateProject.isPending}
        >
          Enable Authentication
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">Authentication</h1>
        <p className="text-muted-foreground">
          Enable authentication for your project, so only authenticated users
          can submit testimonials.
        </p>

        <Button
          onClick={() =>
            updateProject.mutate({
              values: { authsEnabled: false },
            })
          }
          variant="destructive"
        >
          Disable Authentication
        </Button>
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-2">
        {authProviders.map((provider) => (
          <div key={provider.key} className="space-y-4 rounded-xl border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="">{provider.name}</p>
              <Switch
                id={provider.key}
                disabled={
                  project.data?.auths?.length === 1 &&
                  project.data.auths.includes(provider.key)
                }
                checked={project.data?.auths?.includes(provider.key)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateProject.mutate({
                      values: {
                        auths: [...(project.data?.auths || []), provider.key],
                      },
                    });
                  } else {
                    updateProject.mutate({
                      values: {
                        auths: project.data?.auths?.filter(
                          (auth) => auth !== provider.key
                        ),
                      },
                    });
                  }
                }}
              />
            </div>
            {project.data?.auths?.includes(provider.key) && (
              <div key={provider.key} className="flex flex-col gap-2 text-sm">
                {provider.requirements.map((requirement) => (
                  <EachEnvVariable
                    key={requirement}
                    requirement={requirement}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EachEnvVariable({ requirement }: { requirement: string }) {
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const check = async () => {
      const isAvailable = await checkEnvVariables(requirement);
      setIsAvailable(isAvailable);
    };
    check();
  }, [requirement]);

  return (
    <div
      key={requirement}
      className="text-muted-foreground flex items-center gap-2 text-sm"
    >
      {requirement}

      {isAvailable !== undefined &&
        (isAvailable ? (
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        ) : (
          <XCircleIcon className="h-4 w-4 text-red-500" />
        ))}
    </div>
  );
}
