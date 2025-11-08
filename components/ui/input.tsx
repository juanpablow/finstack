import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value !== "")
    }

    const isLabelFloating = isFocused || hasValue

    if (label) {
      return (
        <div className="relative w-full">
          <input
            ref={inputRef}
            type={type}
            className={cn(
              "flex h-14 w-full bg-transparent px-0 py-3 text-base text-gray-900 border-0 border-b-2 border-gray-300 rounded-none transition-colors focus:outline-none focus:border-blue-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 peer font-medium",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=" "
            {...props}
          />
          <label
            className={cn(
              "absolute left-0 transition-all duration-200 pointer-events-none text-gray-500",
              isLabelFloating
                ? "-top-5 text-xs text-blue-500 font-medium"
                : "top-3 text-base"
            )}
          >
            {label}
          </label>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full bg-transparent px-0 py-3 text-base text-gray-900 border-0 border-b-2 border-gray-300 rounded-none transition-colors placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
