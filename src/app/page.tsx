import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root to a demo invite page to show off the design
  redirect("/invite/demo");
}
