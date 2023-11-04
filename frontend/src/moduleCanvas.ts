// The Module Canvas is the sub-component of the ModuleBuilder class on which the user 'paints' the shapes for a new module
import P5 from "p5";
import { CONSTANTS, ModuleInfo, Shape } from "./constants";
import EditorField from "./editorField";

export default class ModuleCanvas extends EditorField {
    // Module Canvas types:
    _topMargin: number;     // Margins are in terms of pixels
    _leftMargin: number;
    _moduleWidth: number;   // Width is in terms of grid spaces in the actual game
    _moduleHeight: number;
    _scale: number;         // Ratio of pixels in the canvas to the real size of the module being painted (> 1 = canvas is blown up)
    _smarsModuleWidth;      // From SMARS' frontend constants; used to translate module w/h values to editor screen pixels
    _shapes: Shape[];       // The existing shapes that have already been drawn for the module being designed
    _currentlyDrawing: Shape | null;    // The shape that is currently being drawn, if any

    constructor(x: number, y: number, w: number, h: number, label?: string) {
        super(x, y, w, h, label);
        this._topMargin = 24;
        this._leftMargin = 24;
        this._moduleWidth = 1;
        this._moduleHeight = 1;
        this._scale = 4;                    // Scale starts at 4x magnification, but will decrease if the user requests a very large module
        this._smarsModuleWidth = CONSTANTS.SMARS_BLOCK_WIDTH;        // Taken from SMARS repo: frontend/src/constants.ts
        this._shapes = [];                  // By default, since no shapes have been drawn yet, this list is empty
        this._currentlyDrawing = null;      // By default, no shapes are being drawn
    }

    setup = () => {
        this._buttons = [];
    }

    // SECTION 1: Canvas dimensions updater

    // Increases/decreases the canvas in either vertical or horizontal direction
    updateCanvasSize = (w: number, h: number) => {
        this._moduleWidth = w;
        this._moduleHeight = h;
        if (this._moduleWidth > 7 || this._moduleHeight > 7) {      // TODO: Complete the thought here by making a switch case and setting limits
            this._scale = 2;
        } else {
            this._scale = 4;
        }
    }

    // SECTION 2: Shape Creation Methods (called by the Module Builder class's click handlers)

    // Handles Rectangle placement. NOTE: This assumes the first click is always at the top-left corner of the new shape
    handleRect = (click: number, mouseX: number, mouseY: number) => {
        switch (click) {
            case 0:
                const { x, y } = this.convertMouseToGrid(mouseX, mouseY);   // Get the rectangle's x and y values from the first click
                this._currentlyDrawing?.params.push(x);
                this._currentlyDrawing?.params.push(y);
                return null;        // If the shape isn't ready yet, return a null
            case 1:
                const click2 = this.convertMouseToGrid(mouseX, mouseY);   // Extrapolate the w and h values from click # 2
                if (this._currentlyDrawing && this._currentlyDrawing.params.length === 2) {
                    const w = click2.x - this._currentlyDrawing.params[0];
                    const h = click2.y - this._currentlyDrawing.params[1];
                    this._currentlyDrawing.params.push(w);
                    this._currentlyDrawing.params.push(h);
                } else {
                    console.log("ERROR: Unable to extrapolate rectangle width/height since x and y values are missing");
                }
                if (this._currentlyDrawing) this._shapes.push(this._currentlyDrawing);  // Add to shapes list when finished
                return this._currentlyDrawing;   // Once the shape is complete, return it to the Module Builder class
            default:
                console.log("ERROR: Too many clicks... Or were you trying to round the corners?");
                return null;        // If the click number is invalid return null
        }
    }

    handleQuad = (click: number, mouseX: number, mouseY: number) => {
        switch (click) {
            case 0:
                const { x, y } = this.convertMouseToGrid(mouseX, mouseY);   // Get the coordinates for the first corner from click 0
                this._currentlyDrawing?.params.push(x);
                this._currentlyDrawing?.params.push(y);
                return null;        // If the shape isn't ready yet, return a null
            case 1:
                const p2 = this.convertMouseToGrid(mouseX, mouseY);
                this._currentlyDrawing?.params.push(p2.x);
                this._currentlyDrawing?.params.push(p2.y);
                return null;        // If the shape isn't ready yet, return a null
            case 2:
                const p3 = this.convertMouseToGrid(mouseX, mouseY);
                this._currentlyDrawing?.params.push(p3.x);
                this._currentlyDrawing?.params.push(p3.y);
                return null;        // If the shape isn't ready yet, return a null
            case 3:
                const p4 = this.convertMouseToGrid(mouseX, mouseY);
                this._currentlyDrawing?.params.push(p4.x);
                this._currentlyDrawing?.params.push(p4.y);
                if (this._currentlyDrawing) this._shapes.push(this._currentlyDrawing);  // Add to shapes list when finished
                return this._currentlyDrawing;
            default:
                console.log("ERROR: Too many clicks for quadrangle placement.");
                return null;        // If the click number is invalid return null
        }
    }

    handleTriangle = (click: number, mouseX: number, mouseY: number) => {
        switch (click) {
            case 0:
                const { x, y } = this.convertMouseToGrid(mouseX, mouseY);   // Get the coordinates for the first corner from click 0
                this._currentlyDrawing?.params.push(x);
                this._currentlyDrawing?.params.push(y);
                return null;        // If the shape isn't ready yet, return a null
            case 1:
                const p2 = this.convertMouseToGrid(mouseX, mouseY);
                this._currentlyDrawing?.params.push(p2.x);
                this._currentlyDrawing?.params.push(p2.y);
                return null;        // If the shape isn't ready yet, return a null
            case 2:
                const p3 = this.convertMouseToGrid(mouseX, mouseY);
                this._currentlyDrawing?.params.push(p3.x);
                this._currentlyDrawing?.params.push(p3.y);
                if (this._currentlyDrawing) this._shapes.push(this._currentlyDrawing);  // Add to shapes list when finished
                return this._currentlyDrawing;
            default:
                console.log("ERROR: Too many clicks for triangle placement.");
                return null;        // If the click number is invalid return null
        }
    }

    handleEllipse = (click: number, mouseX: number, mouseY: number) => {

    }

    handleArc = (click: number, mouseX: number, mouseY: number) => {
        
    }

    // SECTION 3: Shape Creation methods

    // Called by the ModuleBuilder class when the user selects a shape from the (aptly named) shape selector panel; creates a new shape template
    setCurrentShape = (shape: string, color: string) => {
        this._currentlyDrawing = {      // Create a new shape object, and give it the name and shape from the parent class
            shape: shape,
            color: color,
            params: []
        }
    }

    // Takes mouse coordinates and converts them to grid locations for shape positioning
    convertMouseToGrid = (mouseX: number, mouseY: number) => {
        const gridX = (mouseX - this._x - this._leftMargin) / (this._scale * this._smarsModuleWidth);
        const gridY = (mouseY - this._y - this._topMargin) / (this._scale * this._smarsModuleWidth);
        return { x: gridX, y: gridY};
    }

    // Takes grid coordinates for a saved/in-progress shape and converts them back to pixels (for rendering)
    convertGridToPixels = (x: number, y: number) => {
        const pixelX = (x * this._scale * this._smarsModuleWidth) + this._x + this._leftMargin;
        const pixelY = (y * this._scale * this._smarsModuleWidth) + this._y + this._topMargin;
        return { x: pixelX, y: pixelY };
    }

    renderRectPlacement = (p5: P5, mouseX: number, mouseY: number, clickNumber: number) => {
        switch (clickNumber) {
            case 0:
                break;
            case 1:
                if (this._currentlyDrawing && this._currentlyDrawing.params.length === 2) {
                    const { x, y } = this.convertGridToPixels(this._currentlyDrawing.params[0], this._currentlyDrawing.params[1]);
                    p5.fill(CONSTANTS.colors.BLUEGREEN_CRYSTAL);    // Show the first point in blue
                    p5.ellipse(x, y, 8);
                    p5.fill(this._currentlyDrawing.color);         // Trace the resulting rectangle in its intended colour
                    p5.rect(x, y, mouseX - x, mouseY - y);
                }
        }
        // Follow the mouse cursor with a green circle
        p5.fill(CONSTANTS.colors.GREEN_TERMINAL);
        p5.ellipse(mouseX, mouseY, 8);
    }

    renderQuadPlacement = (p5: P5, mouseX: number, mouseY: number, clickNumber: number) => {
        if (this._currentlyDrawing) {
            const p = this._currentlyDrawing.params;    // For convenience
            switch (clickNumber) {
                case 0:
                    break;
                case 1:
                    if (p.length === 2) {
                        const { x, y } = this.convertGridToPixels(p[0], p[1]);
                        p5.fill(CONSTANTS.colors.BLUEGREEN_CRYSTAL);    // Show the first point in blue
                        p5.ellipse(x, y, 8);
                        p5.fill(this._currentlyDrawing.color);         // Trace a line from the first point to the current mouse coords
                        p5.line(x, y, mouseX, mouseY);
                    }
                    break;
                case 2:
                    if (p.length === 4) {
                        const p1 = this.convertGridToPixels(p[0], p[1]);
                        const p2 = this.convertGridToPixels(p[2], p[3]);
                        p5.fill(CONSTANTS.colors.BLUEGREEN_CRYSTAL);    // Show the corners as blue points
                        p5.ellipse(p1.x, p1.y, 8);
                        p5.ellipse(p2.x, p2.y, 8);
                        p5.fill(this._currentlyDrawing.color);
                        p5.line(p1.x, p1.y, p2.x, p2.y);
                        p5.triangle(p1.x, p1.y, p2.x, p2.y, mouseX, mouseY);
                    }
                    break;
                case 3:
                    if (p.length === 6) {
                        const p1 = this.convertGridToPixels(p[0], p[1]);
                        const p2 = this.convertGridToPixels(p[2], p[3]);
                        const p3 = this.convertGridToPixels(p[4], p[5]);
                        p5.fill(CONSTANTS.colors.BLUEGREEN_CRYSTAL);    // Show the corners as blue points
                        p5.ellipse(p1.x, p1.y, 8);
                        p5.ellipse(p2.x, p2.y, 8);
                        p5.ellipse(p3.x, p3.y, 8);
                        p5.fill(this._currentlyDrawing.color);
                        p5.quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, mouseX, mouseY);
                    }
            }
        }
        
        // Follow the mouse cursor with a green circle
        p5.fill(CONSTANTS.colors.GREEN_TERMINAL);
        p5.ellipse(mouseX, mouseY, 8);
    }

    renderTrianglePlacement = (p5: P5, mouseX: number, mouseY: number, clickNumber: number) => {
        if (this._currentlyDrawing) {
            const p = this._currentlyDrawing.params;    // For convenience
            switch (clickNumber) {
                case 0:
                    break;
                case 1:
                    if (p.length === 2) {
                        const { x, y } = this.convertGridToPixels(p[0], p[1]);
                        p5.fill(CONSTANTS.colors.BLUEGREEN_CRYSTAL);    // Show the first point in blue
                        p5.ellipse(x, y, 8);
                        p5.fill(this._currentlyDrawing.color);         // Trace a line from the first point to the current mouse coords
                        p5.line(x, y, mouseX, mouseY);
                    }
                    break;
                case 2:
                    if (p.length === 4) {
                        const p1 = this.convertGridToPixels(p[0], p[1]);
                        const p2 = this.convertGridToPixels(p[2], p[3]);
                        p5.fill(CONSTANTS.colors.BLUEGREEN_CRYSTAL);    // Show the corners as blue points
                        p5.ellipse(p1.x, p1.y, 8);
                        p5.ellipse(p2.x, p2.y, 8);
                        p5.fill(this._currentlyDrawing.color);
                        p5.line(p1.x, p1.y, p2.x, p2.y);
                        p5.triangle(p1.x, p1.y, p2.x, p2.y, mouseX, mouseY);
                    }
                    break;
            }
        }
        // Follow the mouse cursor with a green circle
        p5.fill(CONSTANTS.colors.GREEN_TERMINAL);
        p5.ellipse(mouseX, mouseY, 8);
    }

    renderEllipsePlacement = (p5: P5, mouseX: number, mouseY: number, clickNumber: number) => {

    }

    renderArcPlacement = (p5: P5, mouseX: number, mouseY: number, clickNumber: number) => {

    }

    // Optionally takes mouse coordinates + click number if a new shape is being drawn
    render = (p5: P5, mouseX?: number, mouseY?: number, clickNumber?: number) => {
        p5.fill("#0F0F0F");
        p5.stroke("green");
        p5.rect(this._x, this._y, this._width, this._height, 4, 4, 4, 4);
        p5.fill(CONSTANTS.colors.GREEN_DARK);
        p5.rect(this._x + this._topMargin, this._y + this._leftMargin, this._moduleWidth * this._smarsModuleWidth * this._scale, this._moduleHeight * this._smarsModuleWidth * this._scale);
        // Render any existing shapes first
        this._shapes.forEach((shape) => {
            const x = this._x + this._leftMargin;
            const y = this._y + this._topMargin
            const p = shape.params;
            const b = this._smarsModuleWidth * this._scale;
            p5.fill(shape.color);
            switch (shape.shape) {
                case "triangle":
                    p5.triangle(p[0] * b + x, p[1] * b + y, p[2] * b + x, p[3] * b + y, p[4] * b + x, p[5] * b + y);
                    break;
                case "rect":
                    if (shape.params.length === 4) {
                        p5.rect(p[0] * b + x, p[1] * b + y, p[2] * b, p[3] * b);
                    } else {
                        p5.rect(p[0] * b + x, p[1] * b + y, p[2] * b, p[3] * b, p[4] * b, p[5] * b, p[6] * b, p[7] * b);    // Rounded corners
                    }
                    break;
                case "quad":
                    p5.quad(p[0] * b + x, p[1] * b + y, p[2] * b + x, p[3] * b + y, p[4] * b + x, p[5] * b + y, p[6] * b + x, p[7] * b + y);
                    break;
                case "ellipse":
                    p5.ellipse(p[0] * b + x, p[1] * b + y, p[2] * b, p[3] ? p[3] * b : p[2] * b);
                    break;
                case "arc":
                    let mode: any;
                    if (shape.mode === "OPEN") {
                        mode = p5.OPEN;
                    } else if (shape.mode === "PIE") {
                        mode = p5.PIE;
                    } else if (shape.mode = "CHORD") {
                        mode = p5.CHORD;
                    }
                    p5.arc(p[0] * b + x, p[1] * b + y, p[2] * b, p[3] * b, p[4], p[5], mode);
                    break;
            }
        })
        // If a new shape is being drawn, animate the mouse location and partially-formed shape
        if (this._currentlyDrawing && mouseX && mouseY && clickNumber !== undefined) {
            switch (this._currentlyDrawing.shape) {
                case "rect":
                    this.renderRectPlacement(p5, mouseX, mouseY, clickNumber);
                    break;
                case "quad":
                    this.renderQuadPlacement(p5, mouseX, mouseY, clickNumber);
                    break;
                case "triangle":
                    this.renderTrianglePlacement(p5, mouseX, mouseY, clickNumber);
                    break;
                case "ellipse":
                    this.renderEllipsePlacement(p5, mouseX, mouseY, clickNumber);
                    break;
                case "arc":
                    this.renderArcPlacement(p5, mouseX, mouseY, clickNumber);
                    break;
            }
        }
    }

}