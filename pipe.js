
class Pipe {

    constructor(group, screenHeight, screenWidth, posX, posY) {

        this.group = group;

        this.dead = false;

        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;

        this.pos = new Vector2D(posX, posY);

        this.width = 0.05*this.screenWidth;
        this.height = this.screenHeight-this.pos.y;

        this.spd = (2/400)*this.screenWidth;

        this.gap = (Math.random()*0.2 + 0.2) * this.screenHeight;

        this.topRectPos = new Vector2D(this.pos.x, 0);
        this.topRectDims = new Vector2D(this.width, this.pos.y-this.gap);

        this.group.push(this);

        this.middle = new Vector2D(this.pos.x + this.width/2, this.pos.y - this.gap/2);

    }

    onresize(newWidth, newHeight) {

        this.pos.x *= (newWidth/this.screenWidth);
        this.pos.y *= (newHeight/this.screenHeight);

        this.width *= (newWidth/this.screenWidth);
        this.height *= (newHeight/this.screenHeight);

        this.gap *= (newHeight/this.screenHeight);

        this.topRectPos = new Vector2D(this.pos.x, 0);
        this.topRectDims = new Vector2D(this.width, this.pos.y-this.gap);

        this.spd *= (newWidth/this.screenWidth);

        this.screenWidth = newWidth;
        this.screenHeight = newHeight;

    }

    update() {

        if(this.dead) return;

        this.draw();

        if(!STARTED) return;

        this.pos.x -= this.spd;
        this.topRectPos.x -= this.spd;

        
        if(this.reachedEnd()) this.kill(true);

    }

    draw() {

        ctx.fillStyle = '#603450';

        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.fillRect(this.topRectPos.x, this.topRectPos.y, this.topRectDims.x, this.topRectDims.y);


    }

    loop() {

        if(this.pos.x + this.width < 0) {

            this.pos.x = this.screenWidth;
            this.topRectPos.x = this.screenWidth;
            this.topRectDims.y = this.pos.y-(Math.random()*100 + 100);

        }
    }

    reachedEnd() {

        return this.pos.x + this.width < 0;

    }

    kill(respawn = false) {
        this.dead = true;
        this.group.splice(this.group.indexOf(this), 1);

        if(respawn) this.group.push(new Pipe(this.group, this.screenHeight, this.screenWidth, this.group[this.group.length-1].pos.x + 0.2*this.screenWidth, height - Math.random()*this.screenHeight*0.4))

    }

}