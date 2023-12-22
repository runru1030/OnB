import LOGO from "@asets/logo_lg.svg";
import LoadingDots from "@components/LoadingDots";
export default function Loading() {
  return (
    <div className="flex flex-col w-full h-screen px-10 py-28 opacity-50">
      <div className="flex-1 flex flex-col items-center pt-20 gap-10">
        <LOGO />
        <LoadingDots />
      </div>
    </div>
  );
}
