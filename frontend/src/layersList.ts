// The Layers List is a sub-component of the ModuleBuilder class, and contains a dynamic list of a module's shapes (and their render order)
import P5 from "p5";
import { CONSTANTS } from "./constants";
import EditorField from "./editorField";

export default class LayersList extends EditorField{
    // Layers List types:

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
    }

}