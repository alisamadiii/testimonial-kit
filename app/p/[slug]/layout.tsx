import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  House,
  KeyRound,
  Settings,
  Send,
  Archive,
  BarChart,
} from "lucide-react";

import Content from "@/components/content";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";

const tabs = (slug?: string) => [
  {
    name: "Dashboard",
    key: "dashboard",
    icon: House,
  },
  {
    name: "Auth",
    key: "auth",
    icon: KeyRound,
  },
  {
    name: "Send Testimonial",
    key: "send-testimonial",
    icon: Send,
    href: `/t/${slug}`,
  },
  {
    name: "Archive",
    key: "archive",
    icon: Archive,
  },
  {
    name: "Analytics",
    key: "analytics",
    icon: BarChart,
  },
  {
    name: "Settings",
    key: "settings",
    icon: Settings,
  },
];

interface Props {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectLayout({ children, params }: Props) {
  const { slug } = await params;

  return (
    <Content className="flex max-w-none py-0">
      <div className="sticky top-0 flex max-h-screen min-w-48 flex-col items-stretch py-12">
        <Link href="/" className="mb-4 w-fit">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <ChevronLeft />
            Projects
          </Button>
        </Link>
        {tabs(slug).map((tab) => (
          <Link
            href={tab.href || `/p/${slug}/${tab.key}`}
            key={tab.name}
            className={buttonVariants({
              variant: tab.key === slug ? "default" : "ghost",
              size: "sm",
              className: "justify-start",
            })}
          >
            <tab.icon />
            {tab.name}
          </Link>
        ))}
      </div>
      <Separator orientation="vertical" className="!h-screen" />
      <main className="flex-1">{children}</main>
    </Content>
  );
}
