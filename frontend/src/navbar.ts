// A generic sub-component shared by many screens, the Navbar contains high-level editor options (save, load, new, and main menu)
import P5 from "p5";
import Button from "./button";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class Navbar extends EditorField{
    // Navbar types:

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
    }

    // SECTION 1: BUTTON HANDLER METHODS

    // Requests a reset of the current screen and maybe issues a warning if work could be lost in the process
    handleNew = () => {
        console.log("NEW");
    }

    // Attempts to push the current object to the local database
    handleSave = () => {
        console.log("SAVE");
    }

    // Loads a saved object from the DB
    handleLoad = () => {
        console.log("LOAD");
    }

    // Returns to the Main Menu
    handleMenu = () => {
        console.log("MAIN MENU");
    }

}