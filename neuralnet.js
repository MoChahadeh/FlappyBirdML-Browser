if(typeof window === 'undefined') {
    console.log("Node.js detected, loading modules...");
    numbers = require("numbers");
}

class Matrix {

    constructor(rows, cols) {

        this.rows = rows;

        this.cols = cols;

        this.data = [];

        for (let i = 0; i < this.rows; i++) {

            this.data[i] = [];

            for (let j = 0; j < this.cols; j++) {

                this.data[i][j] = 0;

            }

        }


    }

    randomize(min, max) {

        for (let i = 0; i < this.rows; i++) {

            for (let j = 0; j < this.cols; j++) {

                this.data[i][j] = Math.random() * (max - min) + min;

            }

        }

        return this;


    }

    mutate(mutationRate) {

        for(let i = 0; i < this.rows; i++) {

            for (let j = 0; j < this.cols; j++) {

                this.data[i][j] *= 1+((Math.random()* 2 - 1)*mutationRate);

            }

        }
    }

}

class NeuralNet {

    constructor(i, h1, h2, o) {

        this.i = i;
        this.h1 = h1;
        this.h2 = h2;
        this.o = o;


        this.W1 = new Matrix(h1, i).randomize(-0.5, 0.5);
        this.b1 = new Matrix(h1, 1).randomize(-0.5, 0.5);
        
        if(h2) {

            this.W2 = new Matrix(h2, h1).randomize(-0.5, 0.5);
            this.b2 = new Matrix(h2, 1).randomize(-0.5,0.5);
            this.W3 = new Matrix(o, h2).randomize(-0.5,0.5);
            this.b3 = new Matrix(o, 1).randomize(-0.5,0.5);

        }
        else {

            this.W2 = new Matrix(o, h1).randomize(-0.5,0.5);
            this.b2 = new Matrix(o, 1).randomize(-0.5,0.5);

        }


    }

    sigmoid(x) {

        return x.map(row => row.map(col => 1 / (1 + Math.exp(-col))));

    }


    ReLU(x) {
            
        // return x.map(row => row.map(col => Math.max(0, col)));
        return x;
    
    }

    forward(input) {


        this.input = numbers.matrix.transpose(input);

        this.z1 = numbers.matrix.addition(numbers.matrix.multiply(this.W1.data, this.input), this.b1.data);
        this.a1 = this.ReLU(this.z1);

        if(this.h2) {
            this.z2 = numbers.matrix.addition(numbers.matrix.multiply(this.W2.data, this.a1), this.b2.data);
            this.a2 = this.ReLU(this.z2);
            this.z3 = numbers.matrix.addition(numbers.matrix.multiply(this.W3.data, this.a2), this.b3.data);
            this.output = this.sigmoid(this.z3);

        }
        else {

            this.z2 = numbers.matrix.addition(numbers.matrix.multiply(this.W2.data, this.a1), this.b2.data);
            this.output = this.sigmoid(this.z2);

        }

        return this.output;
    }

    mutate(mutationRate) {

        this.W1.mutate(mutationRate);
        this.b1.mutate(mutationRate);
        this.W2.mutate(mutationRate);
        this.b2.mutate(mutationRate);

        if(this.h2) {
            this.W3.mutate(mutationRate);
            this.b3.mutate(mutationRate);
        }


        return this;

    }

    clone() {

        let net = new NeuralNet(this.i, this.h1, this.h2, this.o);

        net.W1 = this.W1;
        net.b1 = this.b1;
        net.W2 = this.W2;
        net.b2 = this.b2;
        net.W3 = this.W3;
        net.b3 = this.b3;

        return net;

    }

}

const net = new NeuralNet(2, 4, 4, 1);

const input = [[0, 1]];

console.log(net.forward(input));

const net2 = net.clone().mutate(0.1);

console.log(net2.forward(input));