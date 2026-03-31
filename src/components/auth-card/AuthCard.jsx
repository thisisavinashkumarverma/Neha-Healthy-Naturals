import './AuthCard.css'

function AuthCard({
  title,
  subtitle,
  fields,
  formData,
  onChange,
  onSubmit,
  submitLabel,
  helperText,
  helperActionLabel,
  onHelperAction,
  onBack,
}) {
  return (
    <section className="auth-card">
      <button type="button" className="auth-card__back" onClick={onBack}>
        Back to landing
      </button>

      <span className="auth-card__eyebrow">NEHA HEALTHY NATURALS</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>

      <form className="auth-card__form" onSubmit={onSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="auth-card__field">
            <span>{field.label}</span>
            {field.type === 'select' ? (
              <select name={field.name} value={formData[field.name]} onChange={onChange}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={onChange}
                required={field.required !== false}
              />
            )}
          </label>
        ))}

        <button type="submit" className="auth-card__submit">
          {submitLabel}
        </button>
      </form>

      <div className="auth-card__helper">
        <span>{helperText}</span>
        <button type="button" onClick={onHelperAction}>
          {helperActionLabel}
        </button>
      </div>
    </section>
  )
}

export default AuthCard
