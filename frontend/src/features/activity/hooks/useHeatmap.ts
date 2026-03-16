
import { useState } from "react";
import type { HeatmapCell } from "../../../shared/types";

export function useHeatmap(cells: HeatmapCell[]) {
  const [tooltip, setTooltip] = useState<HeatmapCell | null>(null);

  const onHover  = (cell: HeatmapCell) => setTooltip(cell);
  const onLeave  = ()=> setTooltip(null);
  const onClick  = (cell: HeatmapCell) =>
    setTooltip(prev => prev?.date === cell.date ? null : cell);

  return { tooltip, onHover, onLeave, onClick, cells };
}
