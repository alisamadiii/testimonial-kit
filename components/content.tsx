import { cn } from "@/lib/utils";

interface ContentProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export default function Content({
  children,
  className,
  ...props
}: ContentProps) {
  return (
    <div
      className={cn(
        "mx-auto min-h-screen w-full max-w-4xl px-4 py-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
