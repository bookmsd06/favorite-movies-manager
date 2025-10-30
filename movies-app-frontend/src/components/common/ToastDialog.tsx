import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ToastType = "info" | "success" | "warning" | "error";

interface ToastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number; // auto-close in ms
}

export const ToastDialog: React.FC<ToastDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  duration = 3000,
}) => {

  const getClass = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      case "info":
      default:
        return "bg-blue-600 text-white";
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`rounded-md border ${getClass()}`}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <div className="flex justify-end mt-2">
          <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
