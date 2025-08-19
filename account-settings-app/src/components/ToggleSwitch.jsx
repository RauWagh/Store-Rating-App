import React from 'react'

function ToggleSwitch({ id, checked, onChange, label, helperText, disabled = false }) {
  return (
    <div className="toggle-row">
      <div className="toggle-meta">
        {label && <label htmlFor={id} className="toggle-label">{label}</label>}
        {helperText && <div className="toggle-helper">{helperText}</div>}
      </div>
      <label className={`switch ${disabled ? 'is-disabled' : ''}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          aria-label={label}
        />
        <span className="slider" />
      </label>
    </div>
  )
}

export default ToggleSwitch

