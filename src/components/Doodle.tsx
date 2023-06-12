import { ReactP5Wrapper, P5CanvasInstance } from "react-p5-wrapper";

export const Doodle = () => {
  console.log("DOOLE- PERON");
  const sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      p5.createCanvas(400, 400);
      p5.background(255);
    };

    p5.draw = () => {
      p5.fill(0);
      p5.stroke(0);
      p5.strokeWeight(25);
      if (p5.mouseIsPressed === true) {
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
};
