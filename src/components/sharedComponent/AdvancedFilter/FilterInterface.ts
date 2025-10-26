import type{ DateRange } from "react-day-picker";
export interface FilterState {
  status: string[];
  creator: string[];
  dateRange: DateRange | undefined;
}