import { useEffect } from "react";
import { useState } from "react"

export default function TasksInfo({taskData, currentList}) {
  const [taskInfo, setTaskInfo] = useState(null);

  useEffect(() => {
    if(!currentList || typeof taskInfo === 'object' && !taskData.length) setTaskInfo(null);

    if(taskData && taskData.length && currentList) {
      const taskDataCurrentList = taskData.filter(({id}) => id === currentList.id)[0];

      if(!taskDataCurrentList) return setTaskInfo(null);

      setTaskInfo(info => ({
        ...info,
        amount : taskDataCurrentList.tasksAmount,
        complete : taskDataCurrentList.completedTasks,
        uncomplete : taskDataCurrentList.uncompletedTasks
      }))
    };
  }, [taskData, currentList]);

  return (
    <div className="my-4 font-semibold">
      <p>Jumlah Tugas : {taskInfo ? taskInfo.amount : "-"} </p>
      <p>Tugas yang selesai : {taskInfo ? taskInfo.complete : "-"}</p>
      <p>Tugas yang belum selesai : {taskInfo ? taskInfo.uncomplete : "-"}</p>
    </div>
  )
}