'use strict';

/*
robotWalk, by Matt Ciocchi, 04/08/2018

Dependencies: node 8 or above.
*/

/*
 Robot class that implements walk and uses history to tell us whether he has visited a coordinate.
*/
class Robot {
    constructor (cursor=[0,0], history) {

        if (!history) {
            history = [cursor];
        }

        this.cursor = cursor;
        this.history = new History([cursor]);
    }

    walk ({direction, distance}) {
        while (distance) {
            distance--;

            swtch:
            switch (true) {

            case (direction === 'NORTH'):
                this.cursor[1]++;
                break swtch;

            case (direction === 'EAST'):
                this.cursor[0]++;
                break swtch;

            case (direction === 'SOUTH'):
                this.cursor[1]--;
                break;

            case (direction === 'WEST'):
                this.cursor[0]--;
                break;

            default:
                throw new Error('unhandled input');
            }

            if (this._visited(this.cursor)) {
                this.done = true;
                break;
            }

            this.history.push(this.cursor);
        }
    }

    _visited (cursor) {
        return this.history.visited(cursor);
    }
}

/*
 Simplistic generator implementation that loops over cardinal directions.
*/
class DirectionGenerator {
    constructor () {
        this.pos = 0;
        this.directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    }

    next () {
        if (this.pos > 3) {
            this.pos = 0;
        }

        let retval = this.directions[this.pos];

        this.pos++;

        return retval;
    }
}

/*
  History stored in order and as a flat map for fastest access time.
*/
class History {
    constructor (hst) {
        this.ordinal = hst;
        this.positions = hst.reduce(function (accumulator, currentvalue) {
            accumulator[JSON.stringify(currentvalue)] = currentvalue;
            return accumulator;
        }, {});
    }

    push (elt) {
        this.positions[JSON.stringify(elt)] = elt;
        this.ordinal.push(elt);
        return elt;
    }

    visited (cursor) {
        return Boolean(this.positions[JSON.stringify(cursor)]);
    }
}

/*

  Example invocation:

  let retval = robotWalk([1,2,4]);
  console.log('retval: ', JSON.stringify(retval));

  Output:

  retval:  [2,-3]

  let retval = robotWalk([1,2,4,1,5]);
  console.log('retval: ', JSON.stringify(retval));

  Output:

  retval:  [1,1]

*/
function robotWalk (x) {
    let robot = new Robot();
    let directionGenerator = new DirectionGenerator();

    for (let instruction of x) {
        if (robot.done) {
            break;
        }

        let direction = directionGenerator.next();

        robot.walk({
            direction: direction,
            distance: instruction
        });
    }

    return robot.cursor;
}

module.exports = robotWalk;
