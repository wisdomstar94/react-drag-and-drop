import { useDragAndDropController } from "@/hooks/use-drag-and-drop-controller/use-drag-and-drop-controller.hook";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import Link from "next/link";
import { Fragment, useState } from "react";

interface Item {
  name: string;
  value: string;
}

export default function Home() {
  

  return (
    <>
      <ul>
        <li>
          <Link href="/test/controller-grouping">/test/controller-grouping</Link>
        </li>
        <li>
          <Link href="/test/one-row-infinite">/test/one-row-infinite</Link>
        </li>
        <li>
          <Link href="/test/one-col-infinite">/test/one-col-infinite</Link>
        </li>
      </ul>
    </>
  );
}
