class Vector2D {

    constructor(x, y) {
            
        this.x = x;
    
        this.y = y;
    
    }

}

class Bird {

    constructor(group, index, pipes, screenWidth, screenHeight) {

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.pos = new Vector2D((20/750)*screenWidth, (160/375)*screenHeight*0.1);
        this.spd = new Vector2D(0, 0);
        this.acc = new Vector2D(0, (0.5/375)*screenHeight);
        this.jumpStrength = -(6/375)*this.screenHeight;

        this.dead = false;
        this.index = index;
        this.group = group;

        this.width = 0.04*screenWidth*0.75;
        this.height = 0.032*screenWidth*0.75;

        this.img = new Image(this.width, this.height);
        this.img.src = 'imgs/bird.png';

        this.pipes = pipes;

        group.push(this);

    }

    onresize(newWidth, newHeight) {

        this.pos.x *= (newWidth/this.screenWidth);

        this.pos.y *= (newHeight/this.screenHeight);

        this.spd.x *= (newWidth/this.screenWidth);
        this.spd.y *= (newHeight/this.screenHeight);

        this.acc.x *= (newWidth/this.screenWidth);
        this.acc.y *= (newHeight/this.screenHeight);

        this.jumpStrength *= (newHeight/this.screenHeight);

        this.width *= (newWidth/this.screenWidth);
        this.height *= (newHeight/this.screenHeight);

        this.screenWidth = newWidth;
        this.screenHeight = newHeight;


    }

    update() {

        if(this.dead) return;

        this.draw();

        if(!STARTED) return;

        this.spd.y += this.acc.y

        this.pos.y += this.spd.y;

        this.ceiling();
        this.checkCollision();
        this.checkFall();

    }

    draw() {

        // this.angle = -this.spd.y;
        // ctx.translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
        // ctx.rotate(this.spd.y/180);
        // ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        // ctx.rotate(-this.spd.y/180);
        // ctx.translate(-this.pos.x - this.width / 2, -this.pos.y - this.height / 2);

        ctx.drawImage(this.img, this.pos.x, this.pos.y, this.width, this.height);


    }

    jump() {

        this.spd.y = this.jumpStrength;

    }

    loop() {
        if(this.pos.x-10 > this.screenWidth) {
            this.pos.x = -this.width-10;
        }
    }

    ceiling() {
            
        if(this.pos.y < 0) {
            this.pos.y = 0;
            this.spd.y = 0;
        }
    
    }

    checkCollision() {

        this.pipes.forEach(pipe => {

            this.right = this.pos.x + this.width;
            this.top = this.pos.y;
            this.bottom = this.pos.y + this.height;
            this.left = this.pos.x;

            if((this.pos.x + this.width > pipe.pos.x && this.pos.x < pipe.pos.x+pipe.width) && (this.pos.y < pipe.pos.y+pipe.height && this.pos.y+this.height > pipe.pos.y)){
                this.dead = true
            }
            if((this.pos.x+ this.width > pipe.pos.x && this.pos.x < pipe.pos.x+pipe.width) && (this.pos.y < pipe.topRectDims.y && this.pos.y+this.height > pipe.topRectPos.y)){
                this.dead = true
            }
        });

    }

    checkFall() {

        if(this.pos.y > this.screenHeight + 10) this.dead = true;

    }

}