export const compareStringArray = (array1: string[], array2: string[]) => {
  const array1Sorted = array1.sort();
  const array2Sorted = array2.sort();

  return (
    array1Sorted.length === array2Sorted.length &&
    array1Sorted.every((value, index) => value === array2Sorted[index])
  );
};
