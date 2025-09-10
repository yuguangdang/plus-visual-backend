const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`, error ? error.stack : '');
  },
  
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

module.exports = logger;
