// Module Endpoints: For getting, writing and updating data in the smars/modules collection
import express from "express";

const router = express.Router();

// Import SMARS module middleware functions:

const { loadModules, loadModuleData } = require("../functions/moduleFunctions");

router.get('/api/load-modules', loadModules);
router.get('/api/load-module-data/:id', loadModuleData);

module.exports = router;