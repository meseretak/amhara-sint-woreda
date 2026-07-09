import { cookies } from "next/headers";
import { getSession } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  // For the login page, just render children without auth wrapper
  if (!sessionToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B1F] via-[#0B3D2E] to-[#145A44]">
        {children}
      </div>
    );
  }

  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#062B1F] via-[#0B3D2E] to-[#145A44]">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}