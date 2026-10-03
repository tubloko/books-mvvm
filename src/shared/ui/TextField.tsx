import type { ChangeEventHandler } from 'react'

interface TextFieldProps {
  label: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

export function TextField({ label, value, onChange }: TextFieldProps) {
  return (
    <label className="text-field">
      <span className="text-field__label">{label}</span>
      <input className="text-field__input" type="text" value={value} onChange={onChange} />
    </label>
  )
}
