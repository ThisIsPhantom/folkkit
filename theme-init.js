(() => {
  let theme = null

  try {
    theme = localStorage.getItem('folkkit:theme')
  } catch {
    // The studio starts light when no explicit preference is available.
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = 'light'
  }

  document.documentElement.setAttribute('data-theme', theme)
})()
