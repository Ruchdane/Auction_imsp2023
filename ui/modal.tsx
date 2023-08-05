"use client";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "../utils";
const Modal = Dialog.Root;
type ModalBodyProps = {
  // Modal
  title: string;
  description?: string;
  size?: string;
  isOpen: boolean;
  children?: ReactNode;
};
interface ModalTriggerProps {
  // Trigger
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}
const ModalTriger = (props: ModalTriggerProps) => {
  return (
    <Dialog.Trigger asChild>
      <Button
        variant="primary"
        className={props.className}
        title={props.label}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {props.icon}
      </Button>
    </Dialog.Trigger>
  );
};
function ModalBody(props: ModalBodyProps) {
  return (
    <Dialog.Portal>
      <motion.div
        initial="closed"
        animate={props.isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 0.5 },
          closed: { opacity: 0 },
        }}
      >
        <Dialog.Overlay className="bg-black fixed inset-0" />
      </motion.div>
      <motion.div
        initial="closed"
        animate={props.isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, scale: 1 },
          closed: { opacity: 0, scale: 0.94 },
        }}
        className="fixed inset-0 z-40 min-h-screen items-center justify-center flex"
      >
        <Dialog.Content
          forceMount
          className={cn(
            props.size ?? "w-full md:max-w-md",
            "overflow-hidden md:rounded-2xl md:border md:shadow-xl bg-secondary",
          )}
        >
          <div className="space-y-3 bg-secondary px-4 py-6">
            <Dialog.Title className="flex justify-between">
              <label className="text-2xl font-bold mb-4 text-primary">
                {props.title}
              </label>
              <Dialog.Close>
                <Button variant="ghost">
                  <X />
                </Button>
              </Dialog.Close>
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm font-normal text-muted">
              {props.description}
            </Dialog.Description>
            {props.children}
          </div>
        </Dialog.Content>
      </motion.div>
    </Dialog.Portal>
  );
}

export { Modal, ModalBody, ModalTriger };
