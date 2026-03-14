// src/middleware/activityLogger.js
const ActivityLog = require("../models/activityLog.model");

/**
 * Factory function — returns a middleware that logs activity
 *
 * Usage in routes:
 * router.post("/", auth, logActivity("expenses","created"), controller)
 */
function logActivity(module, action, getEntityInfo) {
  return async (req, res, next) => {
    // Store original res.json so we can intercept response
    const originalJson = res.json.bind(res);

    res.json = async function (data) {
      // Only log on success (2xx responses)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          // getEntityInfo extracts name/id/meta from req + response data
          const info = getEntityInfo ? getEntityInfo(req, data) : {};

          await ActivityLog.create({
            userId: req.user.id, // set by auth middleware
            module,
            action,
            entityId: info.entityId || data?.data?._id || data?.data?.id,
            entityName:
              info.entityName || data?.data?.name || data?.data?.title,
            meta: info.meta || {},
            date: new Date().toISOString().slice(0, 10),
          });
        } catch (err) {
          // Never block the response if logging fails
          console.error("Activity log error:", err.message);
        }
      }

      return originalJson(data);
    };

    next();
  };
}

module.exports = logActivity;
