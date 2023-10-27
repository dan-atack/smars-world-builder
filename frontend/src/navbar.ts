// A generic sub-component shared by many screens, the Navbar contains high-level editor options (save, load, new, and main menu)
import P5 from "p5";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class Navbar extends EditorField{
    // Navbar types:

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
    }

}