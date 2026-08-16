export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputRequired?: boolean;
  summaryItems?: ConfirmSummaryItem[];
}

export interface ConfirmSummaryItem {
  label: string;
  value: string;
  highlight?: boolean;
}
