"use-client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const REPORT_TOPICS = [
  "Misinformation / Fake News",
  "Inappropriate Content",
  "Violence / Hate Speech",
  "Harassment / Bullying",
  "Spam / Irrelevant Content",
  "Copyright Violation",
  "Other",
];

export const ReportModal = ({ postId, open, onOpenChange, onSubmit }) => {
  const [selected, setSelected] = useState(new Set());
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      // reset local state when closed
      setSelected(new Set());
      setDetail("");
      setSubmitting(false);
    }
  }, [open]);

  function toggleTopic(topic) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (selected.size === 0) return;
    setSubmitting(true);

    const payload = {
      postId: postId,
      userId: 1, //ข้อมูลสมมุติ
      topics: Array.from(selected),
      detail: detail.trim(),
    };

    try {
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      }
      onOpenChange?.(false);
    } catch (err) {
      console.error("Report submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Report this post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Please select the reason(s) you are reporting this post. You can
            select more than one.
          </p>

          <div className="grid grid-cols-1 gap-2">
            {REPORT_TOPICS.map((topic) => (
              <label
                key={topic}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox
                  checked={selected.has(topic)}
                  onCheckedChange={() => toggleTopic(topic)}
                  aria-label={`Report reason: ${topic}`}
                />
                <span className="text-sm">{topic}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Details (optional)</label>
            <Input
              as="textarea"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Tell us more (where applicable)."
              className="h-24 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Provide any additional context or links that help moderators
              review the report.
            </p>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-muted-foreground">
                {selected.size} selected
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange?.(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={selected.size === 0 || submitting}
                >
                  {submitting ? "Reporting..." : "Submit Report"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
