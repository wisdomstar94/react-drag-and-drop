import { useDragAndDropController } from "@/hooks/use-drag-and-drop-controller/use-drag-and-drop-controller.hook";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop/use-drag-and-drop.hook";
import { ICommon } from "@/interfaces/common.interface";
import { Fragment, useState } from "react";

export default function ControllerGroupingTestPage() {
  const [aList, setAList] = useState<ICommon.Item[] | undefined>([
    { name: '안녕하세요 1', value: '안녕하세요 1', },
    { name: '감사해요 1', value: '감사해요 1', },
    { name: '잘있어요 1', value: '잘있어요 1', },
    { name: '다시만나요 1', value: '다시만나요 1', },
  ]);

  const [bList, setBList] = useState<ICommon.Item[] | undefined>([
    { name: '안녕하세요 2', value: '안녕하세요 2', },
    { name: '감사해요 2', value: '감사해요 2', },
    { name: '잘있어요 2', value: '잘있어요 2', },
    { name: '다시만나요 2', value: '다시만나요 2', },
    { name: '아침 해가 뜨면 2', value: '아침 해가 뜨면 2', },
    { name: '매일 같은 사람들과 2', value: '매일 같은 사람들과 2', },
    { name: '또 다시 하루 일을 2', value: '또 다시 하루 일을 2', },
    { name: '시작해 2', value: '시작해 2', },
  ]);

  const [cList, setCList] = useState<ICommon.Item[] | undefined>([
    { name: '안녕하세요 3', value: '안녕하세요 3', },
    { name: '감사해요 3', value: '감사해요 3', },
    { name: '잘있어요 3', value: '잘있어요 3', },
    { name: '다시만나요 3', value: '다시만나요 3', },
  ]);

  const [dList, setDList] = useState<ICommon.Item[] | undefined>([
    { name: '안녕하세요 4', value: '안녕하세요 4', },
    { name: '감사해요 4', value: '감사해요 4', },
    { name: '잘있어요 4', value: '잘있어요 4', },
    { name: '다시만나요 4', value: '다시만나요 4', },
    { name: '아침 해가 뜨면 4', value: '아침 해가 뜨면 4', },
    { name: '매일 같은 사람들과 4', value: '매일 같은 사람들과 4', },
    { name: '또 다시 하루 일을 4', value: '또 다시 하루 일을 4', },
    { name: '시작해 4', value: '시작해 4', },
  ]);

  const dndController = useDragAndDropController<ICommon.Item>({
    onListsChange(map) {
      if (map.has('aList')) {
        setAList(map.get('aList'));
      }
      if (map.has('bList')) {
        setBList(map.get('bList'));
      }
    },
  });

  const dndController2 = useDragAndDropController<ICommon.Item>({
    onListsChange(map) {
      if (map.has('cList')) {
        setCList(map.get('cList'));
      }
      if (map.has('dList')) {
        setDList(map.get('dList'));
      }
    },
  });

  const aListDnD = useDragAndDrop({
    controller: dndController,
    name: 'aList',
    list: aList,
    listLayout: {
      type: 'one-row-infinite',
      // fixedColCount: 2,
    },
  });

  const bListDnD = useDragAndDrop({
    controller: dndController,
    name: 'bList',
    list: bList,
    listLayout: {
      type: 'one-row-infinite',
      // fixedColCount: 3,
    },
  });

  const cListDnD = useDragAndDrop({
    controller: dndController2,
    name: 'cList',
    list: cList,
    listLayout: {
      type: 'one-row-infinite',
      // fixedColCount: 2,
    },
  });

  const dListDnD = useDragAndDrop({
    controller: dndController2,
    name: 'dList',
    list: dList,
    listLayout: {
      type: 'one-row-infinite',
      // fixedColCount: 3,
    },
  });

  return (
    <>
      <div className="h-96"></div>
      <div className="w-full relative grid grid-cols-1 gap-2 box-border p-2">
        <div className="flex flex-wrap gap-2 items-start">
          <div ref={aListDnD.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex">
            {
              aList?.map((x) => {
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
          <div ref={bListDnD.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex">
            {
              bList?.map((x) => {
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
          <div ref={cListDnD.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex">
            {
              cList?.map((x) => {
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
          <div ref={dListDnD.ref} className="w-full box-border p-2 bg-blue-200 pb-14 flex">
            {
              dList?.map((x) => {
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