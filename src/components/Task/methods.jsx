function infoTaskUpdater(data) {
  const completedTasks = data.tasks.filter(({complete}) => complete === true).length;
  const uncompletedTasks = data.tasks.filter(({complete}) => complete === false).length;
  const tasksAmount = data.tasks.length;

  const updatedData = {
    ...data,
    completedTasks,
    uncompletedTasks,
    tasksAmount
  };

  return updatedData;
}

export {
  infoTaskUpdater
}