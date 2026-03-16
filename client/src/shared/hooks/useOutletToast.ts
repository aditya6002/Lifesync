

import { useOutletContext } from "react-router-dom";

interface OutletCtx { toast: (msg: string) => void }

export function useOutletToast(): (msg: string) => void {
  const ctx = useOutletContext<OutletCtx>();
  return ctx?.toast ?? (() => {});
}
