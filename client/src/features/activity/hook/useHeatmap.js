// src/features/activity/hooks/useHeatmap.ts
import { useState } from "react";

export function useHeatmap(cells) {
  const [tooltip, setTooltip] = useState(null);

  const onHover = (cell) => setTooltip(cell);
  const onLeave = () => setTooltip(null);
  const onClick = (cell) =>
    setTooltip((prev) => (prev?.date === cell.date ? null : cell));

  return { tooltip, onHover, onLeave, onClick, cells };
}
