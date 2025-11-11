import type { NextRequest, NextFetchEvent } from 'next/server';

// eslint-disable-next-line
export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // No middleware for static export
}
