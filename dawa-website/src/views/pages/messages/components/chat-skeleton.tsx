export function ChatSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start space-x-4">
          <div className="h-10 w-10 rounded-full bg-primary_1/20" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 rounded bg-primary_1/20" />
              <div className="h-3 w-10 rounded bg-primary_1/10" />
            </div>
            <div className="h-4 w-48 rounded bg-primary_1/15" />
            <div className="h-4 w-40 rounded bg-primary_1/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
