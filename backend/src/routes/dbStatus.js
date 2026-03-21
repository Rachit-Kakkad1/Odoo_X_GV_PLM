const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/db/status — Check health of PostgreSQL
router.get('/status', authMiddleware, (req, res) => {
  try {
    const status = req.dbStatus();
    res.json({
      success: true,
      data: {
        current: status.current,
        healthy: status.postgres.healthy,
        postgres: {
          healthy: status.postgres.healthy
        },
        message: status.message,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('[DB_STATUS_PROB]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve database status' });
  }
});

module.exports = router;
