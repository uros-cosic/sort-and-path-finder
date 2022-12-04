export function mergeSort(arr, left, right, animate = []) {
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
