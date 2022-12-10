const HANDLE_CASE = {
  COMPLETE: "handle_complete",
  CLEAR: "handle_clear",
  DELETE: "handle_delete",
  ADD: "handle_add",
  EDIT: "handle_edit",
  CHANGE: "handle_change",
  GET: "handle_get",
};

function infoTaskUpdater(data) {
  const completedTasks = data.tasks.filter(
    ({ complete }) => complete === true
  ).length;
  const uncompletedTasks = data.tasks.filter(
    ({ complete }) => complete === false
  ).length;
  const tasksAmount = data.tasks.length;

  const updatedData = {
    ...data,
    completedTasks,
    uncompletedTasks,
    tasksAmount,
  };

  return updatedData;
}

export { HANDLE_CASE, infoTaskUpdater };
