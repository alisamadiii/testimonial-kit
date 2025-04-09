import Content from "@/components/content";
import ArchiveTestimonial from "./archive-testimonial";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArchivePage({ params }: Props) {
  const { slug } = await params;

  return (
    <Content>
      <ArchiveTestimonial slug={slug} />
    </Content>
  );
}
