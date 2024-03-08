import { Court } from "@/modules/court/domain/Court";

export interface Shift {
  startHour: string;
  date: Date;
  court: Court;
}
