import { useMemo } from "react";

export const DOTS = "...";

export const usePagination = ({
   siblingCount=1,
  currentPage,
  totalPageCount,
}) => {
  const paginationRange = useMemo(() => {
    //our logic here
    const totalPageNumbers = siblingCount + 5;
    // case 1 :if the number of pages is less than the page numbers
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    //calculating the left and right index
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // calculating that whether we want to show the left dots or right dot or both of them
    // we dont show dots just when there is just one page number to be
    // inserted between the sibling and the page limit
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    const firtsPageIndex = 1;
    const lastPageIndex = totalPageCount;
    //state2: No left dots to show but right one
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }
    //State3: No right dot to show but left one
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - 1, rightItemCount + 1);
      return [firtsPageIndex, DOTS, ...rightRange];
    }
    //state4: both left and rigth to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firtsPageIndex, DOTS, middleRange, DOTS, lastPageIndex];
    }
  }, [siblingCount, currentPage, totalPageCount]);
  return paginationRange;
};

function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (value, index) => index + start);
}
