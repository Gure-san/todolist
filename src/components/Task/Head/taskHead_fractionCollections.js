const MAX_LENGTH_STRING = 20;
const CUT_LIMIT = 17;
const CLIPPER = "...";

function stringTrimmer(element) {
  const elementStr = element.textContent;

  if (elementStr.length >= MAX_LENGTH_STRING) {
    const cuttedStr = elementStr.slice(0, CUT_LIMIT);
    return (element.textContent = `${cuttedStr}${CLIPPER}`);
  }

  return;
}

export { stringTrimmer };
