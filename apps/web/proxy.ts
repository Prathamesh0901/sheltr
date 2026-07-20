import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const session = getSessionCookie(request);

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isProtected = 
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/s') && request.nextUrl.searchParams.get('role') === 'controller'

    if(!session && isAuthPage) {
        return NextResponse.next();
    }

    if(!session && isProtected) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if(session && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/s/:path*', '/r/:path*', '/auth/:path*']
}