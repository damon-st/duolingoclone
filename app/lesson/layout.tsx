import { ReactNode } from "react";

export default function LessonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col size-full">{children}</div>
    </div>
  );
}
