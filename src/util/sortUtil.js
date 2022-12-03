import { v4 as uuidv4 } from "uuid";

function Node(type, height) {
  this.type = type;
  this.height = height;
  this.id = uuidv4();
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

/* ALGORITHMS */

/* QuickSort */

const quickSort = (arr, left, right, swapOrdered = null) => {
  if (left >= right) return;

  const p = partition(arr, left, right, swapOrdered);

  quickSort(arr, left, p - 1, swapOrdered);
  quickSort(arr, p + 1, right, swapOrdered);
};

const partition = (arr, left, right, swapOrdered) => {
  const pivot = arr[right];
  let j = left - 1;
  for (let i = left; i < right; i++) {
    if (arr[i].height < pivot.height) {
      j += 1;
      let temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
      if (swapOrdered) swapOrdered.push([i, j]);
    }
  }

  let temp = arr[j + 1];
  arr[j + 1] = arr[right];
  arr[right] = temp;
  swapOrdered.push([j + 1, right]);

  return j + 1;
};

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

function mergeSort(arr, left, right, animate = []) {
  if (left >= right) return;
  const middle = left + parseInt((right - left) / 2);
  mergeSort(arr, left, middle, animate);
  mergeSort(arr, middle + 1, right, animate);
  merge(arr, left, middle, right, animate);
}

function merge(arr, left, middle, right, animate) {
  let L = new Array(middle - left + 1);
  let R = new Array(right - middle);

  for (let i = 0; i < L.length; i++) L[i] = arr[left + i];
  for (let i = 0; i < R.length; i++) R[i] = arr[middle + i + 1];

  let i = 0;
  let j = 0;
  let k = left;

  while (i < L.length && j < R.length) {
    if (L[i].height <= R[j].height) {
      animate.push([k, L[i]]);
      arr[k++] = L[i++];
    } else {
      animate.push([k, R[j]]);
      arr[k++] = R[j++];
    }
  }

  while (i < L.length) {
    animate.push([k, L[i]]);
    arr[k++] = L[i++];
  }

  while (j < R.length) {
    animate.push([k, R[j]]);
    arr[k++] = R[j++];
  }
}

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
function bubbleSort(arr, animate = []) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j].height > arr[j + 1].height) {
        animate.push([j, j + 1]);
        bsSwap(arr, j, j + 1);
      }
    }
  }
}

const bsSwap = (arr, x, y) => {
  let temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
};

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
