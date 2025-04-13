import Content from "@/components/content";
import AuthContent from "./auth-content";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AuthPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Content>
      <AuthContent slug={slug} />
    </Content>
  );
}
