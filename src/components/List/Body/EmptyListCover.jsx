import noListCover_dark from "../../../assets/List-Section/noTask-dark.png";
import noListCover_light from "../../../assets/List-Section/noTask-light.png";

const SIZE_ICON = 80;

export default function EmptyListCover() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[200px] rounded-md dark:text-tertiary-150 dark:bg-secondary-100">
      <img
        className="mb-2"
        width={SIZE_ICON}
        height={SIZE_ICON}
        src={noListCover_dark}
      />
      <p className="">Tidak ada kategori!</p>
    </div>
  );
}
