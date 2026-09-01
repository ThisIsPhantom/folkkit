export default function LegalArticle({ content, children }) {
  const titleId = `legal-title-${content.testId}`

  return (
    <article
      className="legal-page page-frame"
      aria-labelledby={titleId}
      data-testid={`legal-page-${content.testId}`}
    >
      <header className="legal-page__header">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 id={titleId} className="display">{content.title}</h1>
        <p>{content.intro}</p>
      </header>

      {children}

      <div className="legal-page__sections">
        {content.sections.map(section => (
          <section key={section.id} id={section.id} aria-labelledby={`${content.testId}-${section.id}`}>
            <h2 id={`${content.testId}-${section.id}`}>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>

      <section className="legal-page__sources" aria-labelledby={`${content.testId}-sources`}>
        <h2 id={`${content.testId}-sources`}>{content.sourcesLabel}</h2>
        <ul>
          {content.sources.map(source => (
            <li key={source.id}><a href={source.url}>{source.label}</a></li>
          ))}
        </ul>
      </section>
    </article>
  )
}
