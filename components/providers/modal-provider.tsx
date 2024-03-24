"use client";

import { ExitModal } from "@/components/modal/exit-modal";
import { HeartsModal } from "@/components/modal/hearts-modal";
import { PracticeModal } from "@/components/modal/practice-modal";

export const ModalProvider = () => {
  return (
    <>
      <ExitModal />
      <HeartsModal />
      <PracticeModal />
    </>
  );
};
