// A sub-component of the ModuleBuilder class, the Inputs Area holds the text fields for controlling all of the module's non-visual data
import P5 from "p5";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class InputsArea extends EditorField{
    // Input Area types:

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
    }

}