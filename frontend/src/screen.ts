// The top-level ancestor component of all the various 'screens' in the World Builder's interface.
import P5 from "p5";
import { CONSTANTS } from "./constants";
import Button from "./button";

export default class Screen {
    // Define types here; underscores represent a 'private' value i.e. one that should not be changed from outside:
    _width: number;
    _height: number;
    _buttons: Button[];
    currentScreen: boolean;
    switchScreen: (screen: string) => void;

    constructor(switchScreen: (screen: string) => void) {
        this._width = CONSTANTS.SCREEN_WIDTH;
        this._height = CONSTANTS.SCREEN_HEIGHT;
        this._buttons = [];
        this.currentScreen = false;
        this.switchScreen = switchScreen;
    }

    handleClick = (mouseX: number, mouseY: number) => {
        console.log(`Screen clicked at (${mouseX}, ${mouseY})`);     // Overridden by instantiations
    }

    // App level sketch will not handle any aspect of the game's interface directly; even the background should be rendered here:
    render = (p5: P5) => {
        p5.background(CONSTANTS.APP_BACKGROUND);
    }

    handleClose = () => {
        this.currentScreen = false;
    }

}