import { Request, Response } from "express";
import { MongoClient } from "mongodb";
import assert from "assert";
import { constants } from "../constants";

// Standardize name of the database:
const dbName: string = process.env.DB_NAME as string || "smars";    // Use DB called 'smars' by default
const collectionName = 'modules';
// Simple object shape for displaying the names and types of existing modules in the DB
type ModuleDigestData = {
    name: string,
    type: string
}

export type Resource = [ name: string, quantity: number];

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
}

// Returns a list of "module data" objects: every module's name and type
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
                            name: mod.name,
                            type: mod.type
                        };
                        mods.push(digest);
                    })
                    res.status(200).json({ status: 200, mods: mods})
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

// const loadGameData = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const dbQuery = { "_id": new ObjectId(id) };
//     const client = new MongoClient(constants.DB_URL_STRING, {});
//     try {
//         await client.connect();
//         console.log(`Database connection established. Loading saved game data for save ID ${id}`);
//         const db = client.db(dbName);
//         await db.collection(collectionName).findOne(dbQuery, (err, result) => {
//             if (result != null) {
//                 if (result.difficulty === "") {
//                     console.log(`Warning: No difficulty settings found for save file ${id} - defaulting to 'medium'`);
//                     result.difficulty = "medium";
//                 }
//                 if (result.map_type === "") {
//                     console.log(`Warning: No map type settings found for save file ${id} - defaulting to 'polar'`);
//                     result.map_type = "polar";
//                 }
//                 console.log(`Dispatching saved game data for game ${result.game_name}.`);
//                 res.status(200).json({ status: 200, data: result })
//             } else {
//                 console.log(`Saved game data not found for game ${id}`);
//                 res.status(404).json({ status: 404, message: "Saved game file not found :("});
//             }
//             client.close();
//         })
//     } catch (err) {
//         console.log(`ERROR: The following error occurred while trying to load saved game file ${id}:`);
//         console.log(err);
//     }
// }

module.exports = {
    loadModules
}