import LOGO from "@asets/logo_lg.svg";
export default function Loading() {
  return (
    <div className="flex flex-col w-full h-screen px-10 py-28 opacity-50">
      <div className="flex-1 flex flex-col items-center pt-20 gap-10">
        <LOGO />
        <div className="flex justify-center gap-3">
          <div className="h-3 w-3 animate-[bounce_1s_infinite_100ms] rounded-full bg-grey-400" />
          <div className="h-3 w-3 animate-[bounce_1s_infinite_200ms] rounded-full bg-grey-400" />
          <div className="h-3 w-3 animate-[bounce_1s_infinite_300ms] rounded-full bg-grey-400" />
        </div>
      </div>
    </div>
  );
}
