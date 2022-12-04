import { quickSort } from "./algorithms/quickSort";
import { mergeSort } from "./algorithms/mergeSort";
import { bubbleSort, bsSwap } from "./algorithms/bubbleSort";

function Node(type, height) {
  this.type = type;
  this.height = height;
}

export const generateRandomArray = (numNodes, maxHeight) => {
  let res = [];
  for (let i = 0; i < numNodes; i++) {
    let rng = Math.floor(Math.random() * maxHeight);
    res.push(new Node("unordered", rng));
  }
  res[Math.floor(Math.random() * res.length)] = new Node(
    "unordered",
    maxHeight - 1
  );
  return res;
};

/* QuickSort */

export const visualizeQuickSort = (arr) => {
  let newArr = arr.slice();
  quickSort(newArr, 0, newArr.length - 1);
  return newArr;
};

const qsSwap = (arr, first, second) => {
  let temp = arr[first];
  arr[first] = arr[second];
  arr[second] = temp;
};

export const animateQuickSort = (
  arr,
  updateNodes,
  setSorted,
  setIsSorting,
  sortingSpeed = 10
) => {
  if (sortingSpeed < 34) {
    sortingSpeed = 20;
  } else if (sortingSpeed >= 34 && sortingSpeed < 66) {
    sortingSpeed = 10;
  } else {
    sortingSpeed = 5;
  }
  let arr2 = arr.slice();
  let sortedOrdered = [];
  quickSort(arr, 0, arr.length - 1, sortedOrdered);
  for (let i = 0; i <= sortedOrdered.length; i++) {
    if (i === sortedOrdered.length) {
      setTimeout(() => {
        animateSorted(arr, updateNodes, setSorted, setIsSorting, sortingSpeed);
      }, i * sortingSpeed);
      return;
    }
    setTimeout(() => {
      let first = sortedOrdered[i][0];
      let second = sortedOrdered[i][1];
      qsSwap(arr2, first, second);
      updateNodes(arr2);
    }, i * sortingSpeed);
  }
};

export const animateSorted = (
  arr,
  updateNodes,
  setSorted,
  setIsSorting,
  sortingSpeed = 10
) => {
  if (sortingSpeed < 34) {
    sortingSpeed = 20;
  } else if (sortingSpeed >= 34 && sortingSpeed < 66) {
    sortingSpeed = 10;
  } else {
    sortingSpeed = 5;
  }
  for (let i = 0; i <= arr.length; i++) {
    if (i === arr.length) {
      setTimeout(() => {
        setSorted(true);
        setIsSorting(false);
      }, i * sortingSpeed);
      return;
    }
    setTimeout(() => {
      arr[i].type = "sorted";
      updateNodes(arr);
    }, i * sortingSpeed);
  }
};

/* Merge Sort */

export const visualizeMergeSort = (arr) => {
  mergeSort(arr, 0, arr.length - 1);
  return arr;
};

export const animateMergeSort = (
  arr,
  setArr,
  setSorted,
  setIsSorting,
  sortingSpeed
) => {
  if (sortingSpeed < 34) {
    sortingSpeed = 20;
  } else if (sortingSpeed >= 34 && sortingSpeed < 66) {
    sortingSpeed = 10;
  } else {
    sortingSpeed = 5;
  }
  let arr2 = arr.slice();
  let animate = [];
  mergeSort(arr, 0, arr.length - 1, animate);
  for (let i = 0; i <= animate.length; i++) {
    if (i === animate.length) {
      setTimeout(() => {
        animateSorted(arr, setArr, setSorted, setIsSorting, sortingSpeed);
      }, i * sortingSpeed);
      return;
    }
    setTimeout(() => {
      const [k, newNode] = animate[i];
      arr2[k] = newNode;
      setArr(arr2);
    }, i * sortingSpeed);
  }
};

/* Bubble Sort */

export const visualizeBubbleSort = (arr) => {
  bubbleSort(arr, []);
  return arr;
};

export const animateBubbleSort = (
  arr,
  setArr,
  setSorted,
  setIsSorting,
  sortingSpeed
) => {
  if (sortingSpeed < 34) {
    sortingSpeed = 20;
  } else if (sortingSpeed >= 34 && sortingSpeed < 66) {
    sortingSpeed = 10;
  } else {
    sortingSpeed = 5;
  }
  let animate = [];
  let arr2 = arr.slice();
  bubbleSort(arr, animate);
  for (let i = 0; i <= animate.length; i++) {
    if (i === animate.length) {
      setTimeout(() => {
        animateSorted(arr, setArr, setSorted, setIsSorting, sortingSpeed);
      }, i * sortingSpeed);
      return;
    }
    setTimeout(() => {
      const [first, second] = animate[i];
      bsSwap(arr2, first, second);
      setArr(arr2);
    }, i * sortingSpeed);
  }
};
