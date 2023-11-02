"use client"
import { ReactNode } from "react";

export function LayoutClient(props: { children: ReactNode }) {
  return (
    <>
      { props.children }
    </>
  );
}