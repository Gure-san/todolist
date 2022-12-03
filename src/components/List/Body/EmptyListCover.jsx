import noListCover_dark from "../../../assets/List-Section/noTask-dark.png";
import noListCover_light from "../../../assets/List-Section/noTask-light.png";

const SIZE_ICON = 80;

export default function EmptyListCover() {
  return (
    <section className="w-full flex items-center justify-center rounded-md min-h-[300px] bg-secondary-100 text-tertiary-100">
      <div className="flex flex-wrap items-end justify-center w-max">
        <img width={SIZE_ICON} height={SIZE_ICON} src={noListCover_dark} />
        <p className="">
          Welp...
          <br />
          Masih belum ada kategori~
        </p>
      </div>
    </section>
  );
}
