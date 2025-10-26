export interface BulkActionToolbarProps {
  selectedCount: number;
  onActivate: (ids:number[]) => void;
  onArchive: (ids:number[]) => void;
  onRemove: (ids:number[]) => void;
  onClearSelection: () => void;
  isLoading?: boolean;
}
