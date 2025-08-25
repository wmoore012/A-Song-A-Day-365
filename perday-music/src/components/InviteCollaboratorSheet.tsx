"use client";

import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface InviteCollaboratorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteCollaboratorSheet({ open, onOpenChange }: InviteCollaboratorSheetProps) {
  const [email, setEmail] = useState('');

  const sendInvite = () => {
    // Placeholder for invitation logic
    onOpenChange(false);
    setEmail('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-black/95 border-cyan-400/30 text-white w-[360px]">
        <SheetHeader>
          <SheetTitle className="text-cyan-300">Invite Collaborator</SheetTitle>
          <SheetDescription className="text-white/60">
            Send a link to a friend to join your session.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Input
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button
            onClick={sendInvite}
            disabled={!email.trim()}
            className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-[0_0_12px_rgba(0,255,255,0.6)] hover:shadow-[0_0_24px_rgba(0,255,255,0.9)] transition-shadow"
          >
            Send Invite
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
