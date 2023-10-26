// Module Endpoints: For getting, writing and updating data in the smars/modules collection
import express from "express";

const router = express.Router();

// Import SMARS module middleware functions:

const { loadModules } = require("../functions/moduleFunctions");

router.get('/api/load-modules', loadModules);

module.exports = router;