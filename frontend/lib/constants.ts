import { AlertCircle, Car, Check, Heart, Home, Layers } from "lucide-react";

export const DEFAULT_GOAL_PERCENTAGES = {
  "Gastos fixos": 40,
  Conforto: 10,
  Prazeres: 10,
  Liberdade: 25,
  Conhecimento: 5,
  Emergências: 10,
} as const;

export const CATEGORY_ICONS = {
  "Gastos fixos": Home,
  Emergências: AlertCircle,
  Liberdade: Check,
  Conhecimento: Layers,
  Conforto: Car,
  Prazeres: Heart,
} as const;

export type CategoryName = keyof typeof DEFAULT_GOAL_PERCENTAGES;
