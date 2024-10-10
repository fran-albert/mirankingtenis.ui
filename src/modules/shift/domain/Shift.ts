import { Court } from "@/modules/court/domain/Court";

export interface Shift {
  id: number;
  startHour: string;
  date: Date;
  court: Court | string;
}
