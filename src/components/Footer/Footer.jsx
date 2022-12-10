import githubDark from "../../assets/Footer/github-dark.png";

const ICON_SIZE = 20;

function Footer() {
  return (
    <section className="w-full flex justify-center items-center bg-secondary-150 text-tertiary-100 text-sm p-4 rounded-md mb-10">
      <a className="flex" target={"_blank"} href="https://github.com/Gure-san">
        <span className="mr-2">Github - Gure-san</span>
        <img src={githubDark} width={ICON_SIZE} height={ICON_SIZE} />
      </a>
    </section>
  );
}

export { Footer };
