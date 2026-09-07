"use client";

import { useTransition } from "react";
import { Trash } from "@phosphor-icons/react";
import { removeChild } from "@/actions/children";

export function RemoveChildButton({ childId, childName }: { childId: string; childName: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={`Премахни ${childName}`}
      disabled={pending}
      onClick={() => {
        if (confirm(`Да премахна ли ${childName} от профила?`)) {
          startTransition(() => removeChild(childId));
        }
      }}
      className="uhd-focus-ring flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-50"
    >
      <Trash size={16} />
    </button>
  );
}
