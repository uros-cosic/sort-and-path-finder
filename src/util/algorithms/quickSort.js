export const quickSort = (arr, left, right, swapOrdered = null) => {
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
