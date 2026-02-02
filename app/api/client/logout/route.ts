import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("client_auth");
  cookieStore.delete("client_email");
  cookieStore.delete("client_role");

  return Response.json({
    success: true,
    message: "Logged out",
  });
}
