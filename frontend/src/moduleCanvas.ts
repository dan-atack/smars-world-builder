// The Module Canvas is the sub-component of the ModuleBuilder class on which the user 'paints' the shapes for a new module
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class ModuleCanvas extends EditorField{
    // Module Canvas types:

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
    }

}