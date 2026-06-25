export function AppShell() {
  return (
    <div className="app-shell" aria-hidden="true">
      <header className="skeleton-nav">
        <div className="skeleton-block skeleton-nav-logo" />
        <nav className="skeleton-nav-links">
          <div className="skeleton-block skeleton-nav-link wide" />
          <div className="skeleton-block skeleton-nav-link" />
          <div className="skeleton-block skeleton-nav-link" />
          <div className="skeleton-block skeleton-nav-link" />
        </nav>
        <div className="skeleton-nav-actions">
          <div className="skeleton-block skeleton-nav-search" />
          <div className="skeleton-block skeleton-nav-avatar" />
        </div>
      </header>

      <main className="skeleton-main">
        <aside className="skeleton-col">
          <div className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>
          <div className="skeleton-card fill">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="skeleton-row" key={i}>
                <div className="skeleton-circle sm" />
                <div className="skeleton-stack">
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="skeleton-col">
          <div className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-grid">
              <div className="skeleton-tile" />
              <div className="skeleton-tile" />
              <div className="skeleton-tile" />
            </div>
          </div>
          <div className="skeleton-card fill">
            <div className="skeleton-line title" />
            <div className="skeleton-line full" />
            <div className="skeleton-line full" />
            <div className="skeleton-line long" />
            <div className="skeleton-line full" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line full" />
            <div className="skeleton-line long" />
            <div className="skeleton-line full" />
            <div className="skeleton-line short" />
          </div>
        </section>

        <aside className="skeleton-col">
          <div className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-row">
              <div className="skeleton-circle" />
              <div className="skeleton-stack">
                <div className="skeleton-line medium" />
                <div className="skeleton-line short" />
              </div>
            </div>
          </div>
          <div className="skeleton-card fill">
            <div className="skeleton-line title" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line long" />
            <div className="skeleton-line short" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line long" />
          </div>
        </aside>
      </main>
    </div>
  );
}
