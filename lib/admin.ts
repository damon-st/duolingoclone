import { auth } from "@clerk/nextjs";

const allowdId = ["user_2dlyKA5utuCkleUbe7A5xs26gwX"];

export const getIsAdmin = () => {
  const { userId } = auth();
  if (!userId) return false;
  return allowdId.indexOf(userId) !== -1;
};
