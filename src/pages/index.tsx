import Link from "next/link";

export default function Home() {
  return (
    <>
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
      </ul>
    </>
  );
}
