export interface SegmentedControlOption {
  key: string
  label: string
  isSelected: boolean
  select: () => void
}

interface SegmentedControlProps {
  label: string
  options: SegmentedControlOption[]
}

export function SegmentedControl({ label, options }: SegmentedControlProps) {
  return (
    <div role="radiogroup" aria-label={label} className="segmented-control">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          role="radio"
          aria-checked={option.isSelected}
          className="segmented-control__option"
          onClick={option.select}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
