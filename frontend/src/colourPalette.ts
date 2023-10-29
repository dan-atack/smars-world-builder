// A sub-component of the ModuleBuilder class, the Colour Palette holds the buttons that change the current colour swatch
import P5 from "p5";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class ColourPalette extends EditorField{
    // Colour palette types:
    currentColour: string;

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
        this.currentColour = "blue";
    }

    setup = () => {
        console.log("Setting up");
    }

}