import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        return NextResponse.next();
    }

    const response = await fetch(
        request.nextUrl.origin + "/api/auth/get-session",
        {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        }
    );

    if (!response.ok) {
        return NextResponse.next();
    }

    const session = await response.json();

    if(session && session.user && !session.user.onBoarded) {
        return NextResponse.redirect(new URL("/on-boarding", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};