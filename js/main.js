const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() * 2 - 1) * this.speed;
        this.dy = (Math.random() * 2 - 1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.color = 'blue'; // Reset color to blue
        for (let circle of circles) {
            if (this !== circle && this.isColliding(circle)) {
                this.color = 'red'; // Change color to red on collision
                // Calculate response vector for simple elastic collision
                const angle = Math.atan2(circle.posY - this.posY, circle.posX - this.posX);
                this.dx = -this.speed * Math.cos(angle);
                this.dy = -this.speed * Math.sin(angle);
            }
        }
        this.draw(context);
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }
        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy;
        }
        this.posX += this.dx;
        this.posY += this.dy;
    }

    isColliding(other) {
        const dx = this.posX - other.posX;
        const dy = this.posY - other.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }
}

let circles = [];
const numCircles = 10;

for (let i = 0; i < numCircles; i++) {
    let radius = Math.floor(Math.random() * 75 + 25);
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    circles.push(new Circle(x, y, radius, 'blue', i.toString(), Math.random() * 3 + 1));
}

function updateCircle() {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => circle.update(ctx, circles));
}

updateCircle();
