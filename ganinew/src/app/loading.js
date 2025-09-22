"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Loading() {
  return (
    <Dialog open>
      <DialogContent className="w-full max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="sr-only">Loading</DialogTitle>
        </DialogHeader>

        <img src="/images/cat_loading.gif" alt="Loading..." className="mx-auto" />
      </DialogContent>
    </Dialog>
  );
}
