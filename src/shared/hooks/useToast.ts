import { useState, useCallback } from "react";

interface ToastState {
   open: boolean;
   message: string;
}

interface UseToastReturn {
   toast: ToastState;
   showToast: (message: string) => void;
   hideToast: () => void;
}

/**
 * Manages a Snackbar's open/message state.
 * Pair with MUI <Snackbar open={toast.open} onClose={hideToast} message={toast.message} />
 *
 * @example
 * const { toast, showToast, hideToast } = useToast();
 * showToast("Profile saved!");
 */
export function useToast(): UseToastReturn {
   const [toast, setToast] = useState<ToastState>({ open: false, message: "" });

   const showToast = useCallback((message: string) => {
      setToast({ open: true, message });
   }, []);

   const hideToast = useCallback(() => {
      setToast((prev) => ({ ...prev, open: false }));
   }, []);

   return { toast, showToast, hideToast };
}
