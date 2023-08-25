import {
  Grid,
  Robot,
  readCoordinatesAndOptionallyOrientation,
  run,
} from "./index";

describe("index", () => {
  it("should fail if input is over 100 characters", () => {
    const sampleInput = new Array(11).fill("A B C D E ");

    expect(() => run(sampleInput)).toThrowError("Input too long");
  });

  it("should create and print the grid correctly.", () => {
    const grid = new Grid(5, 3);
    const gridString = grid.toString();
    expect(gridString).toEqual("OOOOOO\nOOOOOO\nOOOOOO\nOOOOOO");
  });

  it("should set and get the grid value correctly.", () => {
    const grid = new Grid(5, 3);
    grid.set(0, 0, "LOST");

    expect(grid.get(0, 0)).toEqual("LOST");
  });

  it("should read the first line of input as width, height correctly.", () => {
    const sampleInput = "5 3";
    const [width, height] =
      readCoordinatesAndOptionallyOrientation(sampleInput);

    expect(width).toEqual(5);
    expect(height).toEqual(3);
  });

  it("should fail if coordinates are more than 50", () => {
    const sampleInput = "50 51";
    expect(() =>
      readCoordinatesAndOptionallyOrientation(sampleInput)
    ).toThrowError("Coordinate too large");
  });

  it("should fail to read first line of input as width, height if they are wrong.", () => {
    const sampleInput = "~ *";
    expect(() =>
      readCoordinatesAndOptionallyOrientation(sampleInput)
    ).toThrowError("Invalid input");
  });

  it("should read orientation too.", () => {
    const sampleInput = "5 3 N";
    const [width, height, orientation] =
      readCoordinatesAndOptionallyOrientation(sampleInput);

    expect(width).toEqual(5);
    expect(height).toEqual(3);
    expect(orientation).toEqual("N");
  });

  it("should fail if orientation is wrong.", () => {
    const sampleInput = "5 3 F";
    expect(() =>
      readCoordinatesAndOptionallyOrientation(sampleInput)
    ).toThrowError("Invalid orientation");
  });

  it("should create a robot at the right grid position and orientation", () => {
    const grid = new Grid(5, 3);
    const robot = new Robot(grid, 1, 1, "E");
    expect(robot.toString()).toEqual("1 1 E");
  });

  it("should move the robot forward correctly", () => {
    const grid = new Grid(5, 3);
    const robot = new Robot(grid, 1, 1, "E");
    robot.moveForward();
    expect(robot.toString()).toEqual("2 1 E");
  });

  it("should turn the robot left correctly", () => {
    const grid = new Grid(5, 3);
    const robot = new Robot(grid, 1, 1, "E");
    robot.turnLeft();
    expect(robot.toString()).toEqual("1 1 N");
  });

  it("should turn the robot right correctly", () => {
    const grid = new Grid(5, 3);
    const robot = new Robot(grid, 1, 1, "E");
    robot.turnRight();
    expect(robot.toString()).toEqual("1 1 S");
  });

  it("should return the expected output from the project spec", () => {
    const sampleInput = [
      "5 3",
      "1 1 E",
      "RFRFRFRF",
      "3 2 N",
      "FRRFLLFFRRFLL",
      "0 3 W",
      "LLFFFLFLFL",
    ];
    const sampleOutput = ["1 1 E", "3 3 N LOST", "2 3 S"];
    const result = run(sampleInput);
    expect(result).toStrictEqual(sampleOutput);
  });
});
