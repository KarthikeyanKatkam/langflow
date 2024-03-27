import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

export default function DeleteConfirmationModal({
  children,
  onConfirm,
  description,
  asChild,
}: {
  children: JSX.Element;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  description?: string;
  asChild?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild={asChild} tabIndex={-1}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <span className="pr-2">Delete</span>
              <Trash2
                className="h-6 w-6 pl-1 text-foreground"
                strokeWidth={1.5}
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        <span>
          Confirm deletion of {description ?? "component"}?<br></br>
          Note: This action is irreversible.
        </span>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={(e) => e.stopPropagation()}
              className="mr-3"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              variant="destructive"
              onClick={(e) => {
                onConfirm(e);
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
