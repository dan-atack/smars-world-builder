import P5 from "p5";

const sketch = (p5: P5) => {

    p5.setup = () => {
        const canvas = p5.createCanvas(960, 640);
        canvas.parent("app");
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