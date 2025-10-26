import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/_alert-dialog';
import { AlertTriangle, Trash2, Archive, UserMinus, Settings } from 'lucide-react';

export type ConfirmationType = 'delete' | 'archive' | 'remove' | 'change' | 'custom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  variant?: 'destructive' | 'default';
  isLoading?: boolean;
}

const typeConfig = {
  delete: {
    icon: Trash2,
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'destructive' as const,
  },
  archive: {
    icon: Archive,
    title: 'Archive Item',
    description: 'Are you sure you want to archive this item? You can restore it later.',
    confirmText: 'Archive',
    variant: 'default' as const,
  },
  remove: {
    icon: UserMinus,
    title: 'Remove Member',
    description: 'Are you sure you want to remove this team member from the project?',
    confirmText: 'Remove',
    variant: 'destructive' as const,
  },
  change: {
    icon: Settings,
    title: 'Confirm Changes',
    description: 'Are you sure you want to apply these changes?',
    confirmText: 'Apply Changes',
    variant: 'default' as const,
  },
  custom: {
    icon: AlertTriangle,
    title: 'Confirm Action',
    description: 'Are you sure you want to continue?',
    confirmText: 'Confirm',
    variant: 'default' as const,
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  type = 'custom',
  variant,
  isLoading = false,
}: ConfirmationModalProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalConfirmText = confirmText || config.confirmText;
  const finalVariant = variant || config.variant;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              finalVariant === 'destructive' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-left">
              {finalTitle}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left mt-2">
            {finalDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto ${
              finalVariant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-600'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {finalConfirmText}...
              </div>
            ) : (
              finalConfirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Convenience components for specific use cases
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="delete"
      title={`Delete ${itemName || 'Item'}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone and will permanently remove all associated data.`}
      isLoading={isLoading}
    />
  );
}

export function ArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="archive"
      title={`Archive ${itemName || 'Item'}`}
      description={`Are you sure you want to archive "${itemName}"? You can restore it from the archived items section later.`}
      isLoading={isLoading}
    />
  );
}
export function ActiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="archive"
      title={`Active ${itemName || 'Item'}`}
      description={`Are you sure you want to active "${itemName}"? You can archived it from the active items section later.`}
      isLoading={isLoading}
    />
  );
}
export function RemoveMemberConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  memberName,
  projectName,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName?: string;
  projectName?: string;
  isLoading?: boolean;
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="remove"
      title="Remove Team Member"
      description={`Are you sure you want to remove ${memberName || 'this member'} from ${projectName || 'the project'}? They will lose access to all project resources.`}
      isLoading={isLoading}
    />
  );
}
