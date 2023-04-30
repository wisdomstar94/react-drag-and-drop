export declare namespace IUseAddEventListener {
  export interface Props {
    targetElementRef: { current: any };
    eventName: keyof HTMLElementEventMap;
    eventListener: (event: any) => void;
    isApply?: boolean;
  }
}