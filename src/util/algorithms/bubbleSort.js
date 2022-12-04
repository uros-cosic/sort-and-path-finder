export function bubbleSort(arr, animate = []) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j].height > arr[j + 1].height) {
        animate.push([j, j + 1]);
        bsSwap(arr, j, j + 1);
      }
    }
  }
}

export const bsSwap = (arr, x, y) => {
  let temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
};
