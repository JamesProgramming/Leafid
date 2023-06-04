import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
//\import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";

export async function middleware(request: NextRequest) {
  let re: Response;
  try {
    re = await fetch(process.env.NEXT_PUBLIC_API + "/api/v1/user/auth", {
      headers: { jwt: request.cookies.get("jwt")?.value },
      method: "POST",
    });
  } catch (e) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (request.url.endsWith("signin")) {
    return NextResponse.next();
  }

  if (re.status !== 200) {
    console.log(request.url);
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
