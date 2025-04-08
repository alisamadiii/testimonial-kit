import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import Content from "@/components/content";
import { getProjectsById } from "@/db/action";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EachProjectPage({ params }: Props) {
  const { slug } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await getProjectsById(slug);

      if (error) {
        throw new Error(error);
      }

      return data;
    },
  });

  return (
    <Content className="">
      testin
      {/* <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectContent slug={slug} />
      </HydrationBoundary> */}
    </Content>
  );
}
