"use client"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { Fragment, createRef, useEffect, useState } from "react";
import { IUseDragAndDrop } from "../../../..";

interface Item {
  name: string;
  value: string;
}

export default function GroupingTestPage() {
  const [dnd1Lists, setDnd1Lists] = useState<[string, IUseDragAndDrop.List<Item, HTMLDivElement>][]>([
    [
      'aList',
      {
        ref: createRef<HTMLDivElement>(),
        items: [
          { name: '안녕하세요 1', value: '안녕하세요 1', },
          { name: '감사해요 1', value: '감사해요 1', },
          { name: '잘있어요 1', value: '잘있어요 1', },
          { name: '다시만나요 1', value: '다시만나요 1', },
        ],
        listLayout: {
          type: 'one-row-infinite',
        },
      },
    ],
    [
      'bList',
      {
        ref: createRef<HTMLDivElement>(),
        items: [
          { name: '안녕하세요 2', value: '안녕하세요 2', },
          { name: '감사해요 2', value: '감사해요 2', },
          { name: '잘있어요 2', value: '잘있어요 2', },
          { name: '다시만나요 2', value: '다시만나요 2', },
          { name: '아침 해가 뜨면 2', value: '아침 해가 뜨면 2', },
          { name: '매일 같은 사람들과 2', value: '매일 같은 사람들과 2', },
          { name: '또 다시 하루 일을 2', value: '또 다시 하루 일을 2', },
          { name: '시작해 2', value: '시작해 2', },
        ],
        listLayout: {
          type: 'one-row-infinite',
        },
      },
    ],
  ]);
  const dnd1 = useDragAndDrop({
    lists: dnd1Lists,
    onStartDrag(dragFromInfo) {
      console.log('@dnd1.onStartDrag', dragFromInfo);
    },
    onEndDrag(dragFromInfo, dragToInfo, lists) {
      console.log('@dnd1', { dragFromInfo, dragToInfo, lists });
      setDnd1Lists([...lists]);
    },
  });

  const [dnd2Lists, setDnd2Lists] = useState<[string, IUseDragAndDrop.List<Item, HTMLDivElement>][]>([
    [
      'cList',
      {
        ref: createRef<HTMLDivElement>(),
        items: [
          { name: '안녕하세요 3', value: '안녕하세요 3', },
          { name: '감사해요 3', value: '감사해요 3', },
          { name: '잘있어요 3', value: '잘있어요 3', },
          { name: '다시만나요 3', value: '다시만나요 3', },
        ],
        listLayout: {
          type: 'one-row-infinite',
        },
      },
    ],
    [
      'dList',
      {
        ref: createRef<HTMLDivElement>(),
        items: [
          { name: '안녕하세요 4', value: '안녕하세요 4', },
          { name: '감사해요 4', value: '감사해요 4', },
          { name: '잘있어요 4', value: '잘있어요 4', },
          { name: '다시만나요 4', value: '다시만나요 4', },
          { name: '아침 해가 뜨면 4', value: '아침 해가 뜨면 4', },
          { name: '매일 같은 사람들과 4', value: '매일 같은 사람들과 4', },
          { name: '또 다시 하루 일을 4', value: '또 다시 하루 일을 4', },
          { name: '시작해 4', value: '시작해 4', },
        ],
        listLayout: {
          type: 'one-row-infinite',
        },
      },
    ],
  ]);
  const dnd2 = useDragAndDrop({
    lists: dnd2Lists,
    onStartDrag(dragFromInfo) {
      console.log('@dnd2.onStartDrag', dragFromInfo);
    },
    onEndDrag(dragFromInfo, dragToInfo, lists) {
      console.log('@dnd2', { dragFromInfo, dragToInfo, lists });
      setDnd2Lists([...lists]);
    },
  });

  return (
    <>
      <div className="h-96"></div>
      <div className="w-full relative grid grid-cols-1 gap-2 box-border p-2">
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={dnd1.getList('aList')?.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex" data-is-dnd-list={true}>
            {
              dnd1.getList('aList')?.items.map((x) => {
                return (
                  <Fragment key={x.value}>
                    <div className="w-full relative flex border border-1 border-slate-500">
                      <div className="w-16 cursor-move" data-is-dnd-handler={true}>
                        <div className="p-4">@@</div>
                      </div>
                      <div className="w-full flex-1">
                        { x.name }
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={dnd1.getList('bList')?.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex" data-is-dnd-list={true}>
            {
              dnd1.getList('bList')?.items.map((x) => {
                return (
                  <Fragment key={x.value}>
                    <div className="w-full relative flex border border-1 border-slate-500">
                      <div className="w-16 cursor-move" data-is-dnd-handler={true}>
                        <div className="p-4">@@</div>
                      </div>
                      <div className="w-full flex-1">
                        { x.name }
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </div>
        </div>
      </div>
      <div className="w-full relative grid grid-cols-1 gap-2 box-border p-2">
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={dnd2.getList('cList')?.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex" data-is-dnd-list={true}>
            {
              dnd2.getList('cList')?.items.map((x) => {
                return (
                  <Fragment key={x.value}>
                    <div className="w-full relative flex border border-1 border-slate-500">
                      <div className="w-16 cursor-move" data-is-dnd-handler={true}>
                        <div className="p-4">@@</div>
                      </div>
                      <div className="w-full flex-1">
                        { x.name }
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={dnd2.getList('dList')?.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex" data-is-dnd-list={true}>
            {
              dnd2.getList('dList')?.items.map((x) => {
                return (
                  <Fragment key={x.value}>
                    <div className="w-full relative flex border border-1 border-slate-500">
                      <div className="w-16 cursor-move" data-is-dnd-handler={true}>
                        <div className="p-4">@@</div>
                      </div>
                      <div className="w-full flex-1">
                        { x.name }
                      </div>
                    </div>
                  </Fragment>
                );
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}