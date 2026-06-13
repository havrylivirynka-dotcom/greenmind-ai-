import { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = { title: "GreenMind AI — Dashboard" };

export default function DashboardPage() {
  return <DashboardContent />;
}
