// A generic sub-component shared by many screens, the Navbar contains high-level editor options (save, load, new, and main menu)
import P5 from "p5";
import Button from "./button";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class Navbar extends EditorField{
    // Navbar types:
    _buttonX: number;
    _buttonY: number;
    _buttonWidth: number;
    _buttonHeight: number;
    _buttonTextSize: number;
    _buttonMargin: number;
    switchScreen: (screen: string) => void;

    constructor(x: number, y: number, w: number, h: number, switchScreen: (screen: string) => void) {
        super(x, y, w, h);
        this._buttonX = this._x + 8;
        this._buttonY = this._y + 16;
        this._buttonWidth = 216;
        this._buttonHeight = 48;
        this._buttonTextSize = 36;
        this._buttonMargin = 16;
        this.switchScreen = switchScreen;
    }

    // SECTION 0: SETUP

    setup = () => {
        const newButton = new Button("NEW", this._buttonX + this._buttonMargin, this._buttonY, this.handleNew, this._buttonWidth, this._buttonHeight, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, this._buttonTextSize);
        this._buttons.push(newButton);
        const saveButton = new Button("SAVE", this._buttonX + this._buttonWidth + this._buttonMargin * 2, this._buttonY, this.handleSave, this._buttonWidth, this._buttonHeight, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, this._buttonTextSize);
        this._buttons.push(saveButton);
        const loadButton = new Button("LOAD", this._buttonX + this._buttonWidth * 2 + this._buttonMargin * 3, this._buttonY, this.handleLoad, this._buttonWidth, this._buttonHeight, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, this._buttonTextSize);
        this._buttons.push(loadButton);
        const menuButton = new Button("MENU", this._buttonX + this._buttonWidth * 3 + this._buttonMargin * 4, this._buttonY, this.handleMenu, this._buttonWidth, this._buttonHeight, CONSTANTS.colors.GREEN_TERMINAL, CONSTANTS.colors.GREEN_DARK, this._buttonTextSize);
        this._buttons.push(menuButton);
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