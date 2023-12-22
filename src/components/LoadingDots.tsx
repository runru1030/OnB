export default function LoadingDots() {
  return (
    <div className="flex justify-center gap-3">
      <div className="h-3 w-3 animate-[bounce_1s_infinite_100ms] rounded-full bg-grey-200" />
      <div className="h-3 w-3 animate-[bounce_1s_infinite_200ms] rounded-full bg-grey-200" />
      <div className="h-3 w-3 animate-[bounce_1s_infinite_300ms] rounded-full bg-grey-200" />
    </div>
  );
}
