let isDbHealthy = true;
let healthCheckInterval = null;

const checkHealth = async (queryFn) => {
  try {
    await queryFn('SELECT 1');
    if (!isDbHealthy) {
      console.log('[HEALTH] ✓ Database connection restored. Resuming normal operations.');
      isDbHealthy = true;
    }
  } catch (err) {
    if (isDbHealthy) {
      console.error('[HEALTH] ✗ Database connection lost. Error:', err.message);
      if (err.code) console.error('[HEALTH] Error code:', err.code);
      isDbHealthy = false;
    } else {
      // Still unhealthy — log occasionally or just keep it false
      // console.log('[HEALTH] DB still disconnected...');
    }
  }
};

const startHealthCheck = (queryFn, intervalMs = 15000) => {
  if (healthCheckInterval) clearInterval(healthCheckInterval);
  healthCheckInterval = setInterval(() => checkHealth(queryFn), intervalMs);
  // Run once immediately
  checkHealth(queryFn);
};

const getStatus = () => isDbHealthy;
const setHealthy = (status) => { isDbHealthy = status; };

module.exports = {
  startHealthCheck,
  getStatus,
  setHealthy
};
