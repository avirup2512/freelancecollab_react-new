import { CheckCircle, Archive, Trash2, X } from 'lucide-react';
import { Button } from '../../ui/_button';
import { Separator } from '../../ui/_separator';
import type { BulkActionToolbarProps } from './BulkActionToolbarInterface';
import { useSelector } from 'react-redux';
import { Tab } from '../../../interfaces/App';

export function BulkActionToolbar({
  selectedCount,
  onActivate,
  onArchive,
  onRemove,
  onClearSelection,
  isLoading = false,
}: BulkActionToolbarProps) {
  const activateTab = useSelector((e:any) => e.dashboard.activateTab);
  if (selectedCount === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            { activateTab == Tab.ARCHIVE &&
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onActivate}
                    disabled={isLoading}
                    className="gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-700 disabled:opacity-50"
                >
                    <CheckCircle className="w-4 h-4" />
                    Activate
                </Button>
            }
            {activateTab == Tab.ACTIVE &&<Button
              variant="outline"
              size="sm"
              onClick={onArchive}
              disabled={isLoading}
              className="gap-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 disabled:opacity-50"
            >
              <Archive className="w-4 h-4" />
              Archive
            </Button>}
            
           { activateTab == Tab.ARCHIVE && 
            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
              disabled={isLoading}
              className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </Button>}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="gap-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
          Clear Selection
        </Button>
      </div>
    </div>
  );
}