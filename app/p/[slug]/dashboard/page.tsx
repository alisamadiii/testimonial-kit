import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import Content from "@/components/content";
import Testimonials from "./testimonial";
import { getTestimonials } from "@/db/action";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DashboardPage({ params }: Props) {
  const { slug } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["testimonials", slug],
    queryFn: async () => {
      const { data, error } = await getTestimonials({ projectId: slug });

      if (error) {
        throw new Error(error);
      }

      return data;
    },
  });

  return (
    <Content>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Testimonials slug={slug} />
      </HydrationBoundary>
    </Content>
  );
}
