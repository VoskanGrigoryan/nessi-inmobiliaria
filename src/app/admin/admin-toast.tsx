"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icon";

type AdminToastProps = {
  message: string;
  variant: "success" | "error";
};

export function AdminToast({ message, variant }: AdminToastProps) {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const isSuccess = variant === "success";

  useEffect(() => {
    window.history.replaceState(window.history.state, "", pathname);
    const timer = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role={isSuccess ? "status" : "alert"}
          aria-live={isSuccess ? "polite" : "assertive"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`fixed bottom-20 left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl px-8 py-5 text-base text-white shadow-lg sm:bottom-6 sm:left-6 ${isSuccess ? "bg-green-600" : "bg-red-700"}`}
        >
          <span className="min-w-0">{message}</span>
          <Icon name={isSuccess ? "check" : "info"} className="size-5 shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
