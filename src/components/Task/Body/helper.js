const getIndexTaskInfo = (() => {
  let initialIndex = 0;
  return (lengthData) => {
    if (initialIndex === lengthData - 1) return (initialIndex = 0);
    return (initialIndex += 1);
  };
})();

export { getIndexTaskInfo };
