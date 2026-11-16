(() => {
  const storageKey = 'jamie.theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let preference = 'system';
  let choice;

  const validPreference = value => ['light', 'dark'].includes(value) ? value : 'system';

  try {
    preference = validPreference(localStorage.getItem(storageKey));
  } catch {
    // The system default and manual switch still work when storage is blocked.
  }

  function applyTheme() {
    root.dataset.theme = preference;
    const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
    themeColor.content = dark ? '#191a17' : '#f4f3ee';
    if (choice) choice.value = preference;
  }

  // Apply the saved preference before the stylesheet and page are rendered.
  applyTheme();
  systemTheme.addEventListener('change', applyTheme);

  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = validPreference(event.newValue);
    applyTheme();
  });

  document.addEventListener('DOMContentLoaded', () => {
    choice = document.getElementById('theme-choice');
    choice.value = preference;
    choice.closest('label').hidden = false;
    choice.addEventListener('change', () => {
      preference = validPreference(choice.value);
      applyTheme();
      try {
        if (preference === 'system') localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, preference);
      } catch {
        // Keep the visitor's choice for this page even without persistence.
      }
    });
  });
})();
