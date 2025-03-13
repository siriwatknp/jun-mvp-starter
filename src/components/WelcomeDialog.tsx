"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateUserData } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Maximum description length
const MAX_DESCRIPTION_LENGTH = 200;

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const { authUser, setUserProfile, userProfile, isNewUser } = useAuth();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(userProfile?.description) && !isNewUser;

  // Reset description when dialog opens
  useEffect(() => {
    if (open) {
      setDescription(userProfile?.description || "");
    }
  }, [open, userProfile?.description]);

  const handleSubmit = async () => {
    if (!authUser) return;

    try {
      setIsSubmitting(true);

      // Update user data in Firestore
      await updateUserData(authUser.uid, { description });

      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          description,
        });
      }

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user description:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    // If dialog is being closed and it's a new user with no description,
    // still save an empty description to prevent the dialog from showing again
    if (!open && isNewUser && !userProfile?.description && authUser) {
      updateUserData(authUser.uid, { description: "" });
    }

    onOpenChange(open);
  };

  // Handle description change with length limit
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  // Calculate remaining characters
  const remainingChars = MAX_DESCRIPTION_LENGTH - description.length;
  const isDescriptionChanged = userProfile?.description !== description;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNewUser ? "Welcome! 👋" : "About You"}</DialogTitle>
          <DialogDescription>
            {isNewUser
              ? "Tell us a little bit about yourself. This will be displayed in your profile."
              : "Update your personal description. This will be displayed in your profile."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Textarea
              placeholder="I'm a software developer who loves hiking and photography..."
              value={description}
              onChange={handleDescriptionChange}
              className="min-h-[120px] resize-none pr-16"
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {remainingChars} left
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                setDescription("");
              }}
              disabled={isSubmitting}
              className="mr-auto"
            >
              Clear
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !description.trim() ||
              (!isDescriptionChanged && isEditing)
            }
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
