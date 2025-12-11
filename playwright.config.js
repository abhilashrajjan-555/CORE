export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'file:///Users/abhilashrajan/Developer/C.O.R.E. Workflow/index.html',
    headless: true,
  },
  webServer: null, // We're testing a static file, not a web server
};
