"use client";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./button";
type ModalProps = {
  // Trigger
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
  // Modal
  title: string;
  description: string;
  form: React.ReactNode;
};

export function Modal(props: ModalProps) {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="primary" title={props.label} disabled={props.disabled}>
          {props.icon}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 0.5 },
            closed: { opacity: 0 },
          }}
        >
          <Dialog.Overlay className="bg-black fixed inset-0" />
        </motion.div>
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, scale: 1 },
            closed: { opacity: 0, scale: 0.94 },
          }}
          className="fixed inset-0 z-40 min-h-screen items-center justify-center flex"
        >
          <Dialog.Content
            forceMount
            className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:shadow-xl bg-primary"
          >
            <div className="space-y-3 bg-primary px-4 py-6">
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
              {props.form}
            </div>
          </Dialog.Content>
        </motion.div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
