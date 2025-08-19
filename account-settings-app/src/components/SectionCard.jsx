import React from 'react'

function SectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="section-content">
        {children}
      </div>
      {actions && (
        <div className="section-actions">
          {actions}
        </div>
      )}
    </section>
  )
}

export default SectionCard

