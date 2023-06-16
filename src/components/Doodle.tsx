import { memo } from "react";
import { ReactP5Wrapper, P5CanvasInstance } from "react-p5-wrapper";

const Doodle = memo(() => {
	const sketch = (p5: P5CanvasInstance) => {
		p5.setup = () => {
			p5.createCanvas(380, 380).id("p5canvas");
			p5.background(252, 251, 241);
		};

		p5.draw = () => {
			p5.stroke(16, 16, 16);
			p5.strokeWeight(8);

			if (p5.mouseIsPressed === true) {
				p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
			}
		};
	};

	return <ReactP5Wrapper sketch={sketch} />;
});

export default Doodle;
