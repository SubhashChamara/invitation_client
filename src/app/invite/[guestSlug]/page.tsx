import InviteContainer from "@/components/InviteContainer";

interface PageProps {
  params: Promise<{
    guestSlug: string;
  }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { guestSlug } = await params;

  return <InviteContainer guestSlug={guestSlug} />;
}
