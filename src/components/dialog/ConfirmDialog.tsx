import React from 'react';
// import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string; 
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message, 
  onCancel,
  isLoading = false,
}) => {
  // const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-card text-card-foreground rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-accent rounded transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-muted-foreground mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {/* <button
            onClick={onCancel}
            disabled={isLoading}
            className="
              px-4 py-2 text-sm font-medium rounded-lg
              bg-secondary hover:bg-accent
              text-secondary-foreground hover:text-accent-foreground
              border border-border
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          > */}
            {/* {t('cancel')} */}
          {/* </button> */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="
              px-4 py-2 text-sm font-medium rounded-lg
              bg-destructive hover:bg-destructive/90
              text-destructive-foreground
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Confirm
            {/* {isLoading ? t('loading') : t('confirm')} */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;