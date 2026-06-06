import HomecomingInviteContainer from "@/components/HomecomingInviteContainer";

interface PageProps {
  params: Promise<{
    guestSlug: string;
  }>;
}

export default async function HomecomingInvitePage({ params }: PageProps) {
  const { guestSlug } = await params;

  return <HomecomingInviteContainer guestSlug={guestSlug} />;
}
