import { Metadata } from "next";
import { getWebsiteContent } from "@/lib/content";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "NEXUS // LIVE CONTENT CONTROL · Admin",
  description: "Live Website Content Management System",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getWebsiteContent();

  return <AdminDashboard initialContent={content} />;
}
