import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const FeedWrapper = ({ children }: Props) => {
  return <div className="flex-1 relative top-0 pb-10">{children}</div>;
};
