import './globals.scss';
import { Metadata, Viewport } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { LayoutClient } from "./layout.client";

export const metadata: Metadata = {
  title: `react-drag-and-drop`,
};

export const viewport: Viewport = {
  initialScale: 1,
  userScalable: false,
  width: 'device-width',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <html lang="ko">
        <body>
          <LayoutClient>
            <ul>
              <li>
                <Link href="/test/grouping">/test/grouping</Link>
              </li>
              <li>
                <Link href="/test/one-row-infinite">/test/one-row-infinite</Link>
              </li>
              <li>
                <Link href="/test/one-col-infinite">/test/one-col-infinite</Link>
              </li>
              <li>
                <Link href="/test/fixed-col-count-grid">/test/fixed-col-count-grid</Link>
              </li>
              <li>
                <Link href="/test/zero-base">/test/zero-base</Link>
              </li>
              <li>
                <Link href="/test/drag-effect">/test/drag-effect</Link>
              </li>
              <li>
                <Link href="/test/item-self-dnd-hanlder">/test/item-self-dnd-hanlder</Link>
              </li>
              <li>
                <Link href="/test/board">/test/board</Link>
              </li>
            </ul>
            <div className="w-full block relative">
              { children }
            </div>
          </LayoutClient>
        </body>
      </html>
    </>
  );
}
