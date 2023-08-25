type GridValue = "O" | "LOST" | "OOB";

export class Grid {
  width: number;
  height: number;
  grid: GridValue[][];
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height + 1 }, () =>
      Array.from({ length: width + 1 }, () => "O")
    );
  }

  toString() {
    return this.grid.map((row) => row.join("")).join("\n");
  }

  get(x: number, y: number): GridValue {
    return this.grid[y]?.[x] || "OOB";
  }

  set(x: number, y: number, value: GridValue) {
    this.grid[y][x] = value;
  }
}

const orientations = ["N", "E", "S", "W"] as const;
type Orientation = "N" | "E" | "S" | "W";
export class Robot {
  grid: Grid;
  x: number;
  y: number;
  orientation: Orientation;
  lost: boolean = false;
  constructor(grid: Grid, x: number, y: number, orientation: Orientation) {
    this.grid = grid;
    this.x = x;
    this.y = y;
    this.orientation = orientation;
  }

  moveForward() {
    let newPosition;
    switch (this.orientation) {
      case "N":
        newPosition = this.y + 1;
        // check the grid to see if a the next position is out of bounds
        if (this.grid.get(this.x, newPosition) === "OOB") {
          // check the grid to see if a robot was lost here before
          // if so, don't move
          if (this.grid.get(this.x, this.y) !== "LOST") {
            this.lost = true;
          }
          break;
        }
        this.y = newPosition;
        break;
      case "E":
        newPosition = this.x + 1;
        if (this.grid.get(newPosition, this.y) === "OOB") {
          if (this.grid.get(this.x, this.y) !== "LOST") {
            this.lost = true;
          }
          break;
        }
        this.x = newPosition;
        break;
      case "S":
        newPosition = this.y - 1;
        if (this.grid.get(this.x, newPosition) === "OOB") {
          if (this.grid.get(this.x, this.y) !== "LOST") {
            this.lost = true;
          }
          break;
        }
        this.y = newPosition;
        break;
      case "W":
        newPosition = this.x - 1;
        if (this.grid.get(newPosition, this.y) === "OOB") {
          if (this.grid.get(this.x, this.y) !== "LOST") {
            this.lost = true;
          }
          break;
        }
        this.x = newPosition;
        break;
      default:
        break;
    }

    if (this.lost) {
      this.grid.set(this.x, this.y, "LOST");
    }
  }

  turnLeft() {
    const currentOrientationIndex = orientations.indexOf(this.orientation);
    const newOrientationIndex = (currentOrientationIndex - 1 + 4) % 4;
    this.orientation = orientations[newOrientationIndex];
  }

  turnRight() {
    const currentOrientationIndex = orientations.indexOf(this.orientation);
    const newOrientationIndex = (currentOrientationIndex + 1) % 4;
    this.orientation = orientations[newOrientationIndex];
  }

  toString() {
    const result = `${this.x} ${this.y} ${this.orientation}`;
    if (this.lost) {
      return `${result} LOST`;
    }
    return result;
  }
}

export const readCoordinatesAndOptionallyOrientation = (
  input: string
): [number, number, Orientation?] => {
  const [width, height, orientation] = input.split(" ");

  const parsedwidth = parseInt(width);
  const parsedHeight = parseInt(height);
  const parsedOrientation = orientation as Orientation;

  if (isNaN(parsedwidth) || isNaN(parsedHeight)) {
    throw new Error("Invalid input");
  }
  if (parsedwidth > 50 || parsedHeight > 50) {
    throw new Error("Coordinate too large");
  }
  if (orientation) {
    if (!orientations.includes(orientation as any)) {
      throw new Error("Invalid orientation");
    }
    return [parsedwidth, parsedHeight, parsedOrientation];
  }
  return [parsedwidth, parsedHeight];
};

export const readMovement = (input: string): string[] => {
  const movementArray = input.split("");
  if (movementArray.some((movement) => !["L", "R", "F"].includes(movement))) {
    throw new Error("Invalid movement");
  }
  return movementArray;
};

export const run = (input: string[]): string[] => {
  if (input.join("").length > 100) {
    throw new Error("Input too long");
  }
  // The first element of the input is the grid size, so lets read that.
  const [gridSize, ...rest] = input;
  const [width, height] = readCoordinatesAndOptionallyOrientation(gridSize);
  const grid = new Grid(width, height);

  let currentRobot: Robot | null = null;
  const result: string[] = [];
  rest.forEach((line, i) => {
    //first line will be the position of the robot
    if (i % 2 === 0) {
      // positional code
      const [x, y, orientation] = readCoordinatesAndOptionallyOrientation(line);
      if (orientation) {
        currentRobot = new Robot(grid, x, y, orientation);
      } else {
        throw new Error("Missing orientation");
      }
    } else {
      // movement code
      if (currentRobot === null) throw new Error("Missing robot");
      const movements = readMovement(line);
      movements.forEach((movement) => {
        if (currentRobot?.lost) return;
        if (movement === "L") {
          currentRobot?.turnLeft();
        } else if (movement === "R") {
          currentRobot?.turnRight();
        } else if (movement === "F") {
          currentRobot?.moveForward();
        }
      });
      result.push(currentRobot.toString());
    }
  });

  return result;
};
