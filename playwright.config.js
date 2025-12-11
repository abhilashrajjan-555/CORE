export default {
  testDir: './tests',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:8000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  webServer: null, // We'll start the server manually with python3 -m http.server 8000
};
