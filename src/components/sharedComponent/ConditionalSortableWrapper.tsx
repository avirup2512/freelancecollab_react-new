import { useEffect } from "react";
import SortableWrapper from "./SortableWrapper";
interface ConditionalSortableWrapperProps {
    id: string,
    isListDragging: boolean,
    children: any,
    isLock: boolean
}

function ConditionalSortableWrapper({ id, isListDragging, children, isLock }:ConditionalSortableWrapperProps) {
  return (
    <>
      {isListDragging && (
        <SortableWrapper
          isLock={isLock}
          key={`${id}-${isLock}`}
          id={id}
        >
          {children}
        </SortableWrapper>
      )}
      {!isListDragging && children}
    </>
  );
};

export default ConditionalSortableWrapper;
