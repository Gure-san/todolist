function displayImplementer(data) {
  return data.forEach(({ active, collapsibleElements }) => {
    const { separator, collapsibleElement } = collapsibleElements;
    if (active) {
      separator.style.display = "block";
      collapsibleElement.style.display = "flex";
    } else {
      separator.style.display = "none";
      collapsibleElement.style.display = "none";
    }
  });
}

export { displayImplementer };
