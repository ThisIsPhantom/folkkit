(() => {
  let theme = null

  try {
    theme = localStorage.getItem('folkkit:theme')
  } catch {
    // Use the system preference when browser storage is unavailable.
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  document.documentElement.setAttribute('data-theme', theme)
})()
