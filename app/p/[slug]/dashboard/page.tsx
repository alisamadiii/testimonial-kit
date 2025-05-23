import Content from "@/components/content";
import Testimonials from "./testimonial";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DashboardPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Content>
      <Testimonials slug={slug} />
    </Content>
  );
}
