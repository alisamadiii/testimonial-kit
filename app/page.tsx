"use client";

import Link from "next/link";

import Content from "@/components/content";
import { useGetUser } from "@/auth/useAuth";
import { useGetProjects } from "@/db/use-projects";
import { CreateProjectAlert } from "@/components/alerts/create-project";

import { Project } from "@/db/schema";
import { ProjectChart } from "@/components/project-chart";

export default function Home() {
  const { data: userData } = useGetUser();
  const { data: projects } = useGetProjects();

  return (
    <Content>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Create your first project, {userData?.name}!
          </h1>
          <p className="text-sm">
            You can create your first project by clicking the button below.
          </p>
        </div>

        <CreateProjectAlert />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Content>
  );
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      href={`/p/${project.id}/dashboard`}
      className="rounded-lg border p-4 shadow-sm"
    >
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-medium">{project.name}</h2>
          <p className="text-sm text-gray-500">{project.description}</p>
        </div>
        <ProjectChart analytics={project.analytics.dateTestimonials} />
      </div>

      <div className="mt-4 flex items-center gap-2 *:font-medium">
        <p className="text-sm">
          {project.analytics.totalTestimonialsApproved}/
          {project.analytics.totalTestimonials} Testimonials
        </p>
        <p className="text-sm">{project.analytics.totalViews} Views</p>
      </div>
    </Link>
  );
};
