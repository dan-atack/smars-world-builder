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
    GRAY_DRY_ICE: "#BCC4C1",
    GRAY_LIGHT: "#7D7D7D",
    GRAY_LIGHTISH: "#7C7D99",
    GRAY_MEDIUM: "#626378",
    GRAY_DARK: "#595A6B",
    GRAY_DARKER: "#595A6B",
    GRAY_DARKEST: "#262626",
    GRAY_METEOR: "#353837",
    GRAY_IRON_ORE: "#2E1409",
    GRAY_WHITE: "#E5E6E1",
    EGGSHELL: "#F6F7E9",
    RED_ERROR: "#D10000",
    RED_CONTRAST: "#FF4230",
    RED_BG: "#450701",
    RED_ROCK: "#882000",
    BROWN_SAND: "#B8A27D",
    BROWN_BRINE: "#59502E",
    BROWN_MUD: "#3B1E05",
    ORANGE_JUMPSUIT: "#C77E00",
    ORANGE_COPPER: "#8C5827",
    YELLOW_BG: "#544503",
    YELLOW_TEXT: "#FFD412",
    YELLOW_SKY: "#C9A551",
    BLUE_ICE: "#A0EBE3",
    BLUE_DIRTY: "#2E4A59",
    BLUE_SUNSET: "#050094",
    GREEN_LEAVES: "#049426",
    GREEN_TERMINAL: "#0FFF13",
    GREEN_MINIMAP: "#20BD23",
    GREEN_MODULE: "#22B14C",
    GREEN_DARKISH: "#054F07",
    GREEN_DARK: "#023803",
    GREEN_DARKER: "#012400",
    GREEN_DARKEST: "#031A0A",
    BLUEGREEN_CRYSTAL: "#00F2BA",
    BLUEGREEN_DARK: "#052E26",
    BLUE_BG: "#00004F",
    PURPLE_LIGHT: "#A67ACF"
    }
}

