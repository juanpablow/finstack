import { LucideIcon } from "lucide-react"

export interface Category {
  name: string
  budget: number
  spent: number
  remaining: number
  used: string
  total: string
  icon: LucideIcon
  color: string
}
