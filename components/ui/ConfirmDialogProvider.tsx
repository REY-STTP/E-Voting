'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmDialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextValue | undefined
>(undefined);

export const useConfirmDialog = () => {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
  }
  return ctx;
};

interface InternalState extends ConfirmOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<InternalState>({
    isOpen: false,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        resolve,
        title: options.title ?? 'Confirm',
        message: options.message ?? 'Are you sure?',
        confirmText: options.confirmText ?? 'Yes',
        cancelText: options.cancelText ?? 'Cancel',
      });
    });
  }, []);

  const handleClose = (result: boolean) => {
    if (state.resolve) {
      state.resolve(result);
    }
    setState((prev) => ({ ...prev, isOpen: false, resolve: undefined }));
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      {state.isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                {state.title}
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-slate-200">
                {state.message}
              </p>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => handleClose(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                {state.cancelText}
              </button>
              <button
                onClick={() => handleClose(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                {state.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};
