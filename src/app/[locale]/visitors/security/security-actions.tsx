"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { checkInVisitor, checkOutVisitor } from "@/lib/visitors";
import { Button } from "@/components/ui/button";

export function SecurityActions({
  visitorId,
  status,
  checkInLabel,
  checkOutLabel,
}: {
  visitorId: string;
  status: string;
  checkInLabel: string;
  checkOutLabel: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCheckIn = () => {
    startTransition(async () => {
      await checkInVisitor(visitorId);
      router.refresh();
    });
  };

  const handleCheckOut = () => {
    startTransition(async () => {
      await checkOutVisitor(visitorId);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-2">
      {status !== "checked_in" && (
        <Button
          size="sm"
          onClick={handleCheckIn}
          disabled={isPending}
        >
          {checkInLabel}
        </Button>
      )}
      {status === "checked_in" && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCheckOut}
          disabled={isPending}
        >
          {checkOutLabel}
        </Button>
      )}
    </div>
  );
}
