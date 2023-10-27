import P5 from "p5";
import { getModules, getOneModule } from "./server_functions";

const sketch = (p5: P5) => {

    p5.setup = () => {
        const canvas = p5.createCanvas(960, 640);
        canvas.parent("app");
        p5.background(0);
        const setter = () => {};
        getModules(setter);
        const id = "6505d7b4fa92111e5e312e22";  // test id for cantina
        getOneModule(id, setter);
    }

    p5.mouseClicked = () => {
        console.log(`${p5.mouseX}, ${p5.mouseY}`);
    }

    p5.draw = () => {
        p5.fill(255, 0, 0);
        p5.rect(100, 100, 100, 100);
    }

}

new P5(sketch);