import { useOutletContext } from "react-router-dom";

export function useOutletToast() {
  const ctx = useOutletContext();
  return ctx?.toast ?? (() => {});
}
