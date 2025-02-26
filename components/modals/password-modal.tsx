"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PlusCircle } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

export const PasswordModal = ({ password, setPassword }: any) => {
  return (
    <Dialog open={password !== 'jd3t2'}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password pls -_-</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password -_-"
            className="h-10 px-2 focus-visible:ring-transparent rounded-tr-none rounded-br-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
