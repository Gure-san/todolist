import noTasks_dark from "../../../assets/Task-Section/emptyTask-dark.png";

const ICON_SIZE = 80;

export default function EmptyTaskCover() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[200px] rounded-md dark:text-tertiary-150 dark:bg-secondary-100 my-8">
      <img src={noTasks_dark} width={ICON_SIZE} height={ICON_SIZE} />
      <p> Tidak ada tugas! </p>
    </div>
  );
}
