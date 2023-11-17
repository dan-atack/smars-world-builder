// Module Endpoints: For getting, writing and updating data in the smars/modules collection
import express from "express";

const router = express.Router();

// Import SMARS module middleware functions:

const { loadModules, loadModuleData, newModuleData } = require("../functions/moduleFunctions");

router.get('/api/get-modules', loadModules);
router.get('/api/get-module-data/:id', loadModuleData);
router.post('/api/add-new-module', newModuleData);

module.exports = router;