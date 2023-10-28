// New architecture idea: Keep all type definitions in the same file! (All type definitions are copied from original SMARS repo)

// Copied from smars' frontend economyData.ts file
export type Resource = [ string, number ];

// Copied from smars' frontend server_functions.ts file
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

export const CONSTANTS = {
    URL_PREFIX: `http://localhost:${process.env.SERVER_PORT || "7001"}/api`,
    // TODO: Copy colour definitions from SMARS Constants
    APP_BACKGROUND: "#000000",
    SCREEN_WIDTH: 1600,
    SCREEN_HEIGHT: 800,
    NAVBAR_X: 320,
    NAVBAR_WIDTH: 960,
    NAVBAR_HEIGHT: 80,
    colors: {
        GREEN_TERMINAL: "#0FFF13",
        GREEN_BACKGROUND: "#023803",
    }
}

