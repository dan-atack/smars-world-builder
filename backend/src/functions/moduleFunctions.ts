import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import assert from "assert";
import { constants } from "../constants";

// Standardize name of the database:
const dbName: string = process.env.DB_NAME as string || "smars";    // Use DB called 'smars' by default
const collectionName = 'modules';
// Simple object shape for displaying the names and types of existing modules in the DB
type ModuleDigestData = {
    id: ObjectId,
    name: string,
    type: string
}

// Copied from the official SMARS type definitions:
export type Resource = [ string, number ];

// Copy Module Data shape from official SMARS type definition:
export type ModuleInfo = {
    name: string            // Unique name of the module; First Letters Capitalized
    width: number           // Width in blocks, not pixels
    height: number          // ditto
    type: string            // Type name will feed into Engine switch case; type names are all LOWERCASE (UNLIKE THESE LETTERS)
    pressurized: boolean    // Give dees people eaaair!
    columnStrength: number  // How many more modules can fit on top of each column of this structure
    durability: number      // Basically hitpoints
    buildCosts: Resource[]        // A list of any kind of Resource, just like storage capacity (see below)
    maintenanceCosts: Resource[]    // Same idea as above
    productionInputs?: Resource[]   // For production modules only, what resources are needed to produce its output?
    productionOutputs?: Resource[]  // For production modules only, the output from a single batch of work
    storageCapacity: Resource[]   // A list of the amount of each type of resource (if any) that can be stored in this module
    crewCapacity: number    // How many humans can fit into a phone booth??
    shapes: {
        shape: string,          // Options are "rect", "quad", "triangle", "ellipse" and "arc"
        color: string,          // Hex codes only, please
        params: number[]        // The arguments for creating the shape - Values are all in terms of GRID SPACES, not pixels!!
        mode?: string           // For optional non-numeric arguments to arc shapes
    }[]
};

// Returns a list of "module data" objects: every module's name, type and id
const loadModules = async (req: Request, res: Response) => {
    const client = new MongoClient(constants.DB_URL_STRING, {});
    try {
        await client.connect();
        console.log("Database connection established. Getting module data info.");
        const db = client.db(dbName);
        await db
            .collection(collectionName)
            .find()
            .toArray((err, result)  => {
                if (err) console.log(err);
                if (result != null) {
                    // If there are maps for a given type, see how many there are:
                    console.log(`Found ${result.length} modules in ${collectionName} collection.`);
                    // Return only a small portion of each file's data:
                    let mods: ModuleDigestData[] = [];
                    result.forEach((mod) => {
                        const digest: ModuleDigestData = {
                            id: mod._id,
                            name: mod.name,
                            type: mod.type
                        };
                        mods.push(digest);
                    })
                    res.status(200).json({ status: 200, data: mods})
                    client.close();
                } else {
                    console.log(`No modules found in ${collectionName} collection.`);
                    client.close();
                }
            });
    } catch (err) {
        console.log("ERROR: The following error occurred while trying to find module data.");
        console.log(err);
    }
}

// Returns the full module data object for one module, given its ID
const loadModuleData = async (req: Request, res: Response) => {
    const { id } = req.params;
    const dbQuery = { "_id" : new ObjectId(id) };
    const client = new MongoClient(constants.DB_URL_STRING, {});
    try {
        await client.connect();
        console.log(`Database connection established. Loading module data for module ${id}.`);
        const db = client.db(dbName);
        await db.collection(collectionName).findOne(dbQuery, (err, result) => {
            if (err) console.log(err);
            if (result != null) {
                console.log(`Loaded module data for ${result._id}.`);
                res.status(200).json({ status: 200, data: result })
            } else {
                console.log(`Data not found for module ${id}`);
                res.status(404).json({ status: 404, message: "Module data not found :("});
            }
            client.close();
        })
    } catch (err) {
        console.log(`ERROR: The following error occurred while trying to load module data for module ${id}:`);
        console.log(err);
    }
}

// Takes a module info object and adds it to the database
const newModuleData = async (req: Request, res: Response) => {
    const data: ModuleInfo = req.body;
    const client = new MongoClient(constants.DB_URL_STRING, {});
    try {
        await client.connect();
        console.log(`Database connection established. Uploading new data for ${data.name} module.`);
        // TODO: See if a module with the same name already exists and refuse the push if so
        const db = client.db(dbName);
        const i = await db.collection(collectionName).insertOne(data);
        assert.notEqual("", i.insertedId);
        console.log(`Uploaded data for new module: ${data.name}`);
        res.status(200);
        client.close();
        console.log("Closing client connection");
    } catch (err) {
        console.log(`ERROR: The following error occurred while trying to post new module data for ${data.name}:`)
        console.log(err);
    }
}

module.exports = {
    loadModules, loadModuleData, newModuleData
}