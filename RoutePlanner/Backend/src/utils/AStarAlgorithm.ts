import { HttpException, HttpStatus } from '@nestjs/common';

const ROW: number = 20;
const COL: number = 20;
class cell {
  // Row and Column index of its parent
  // Note that 0 <= i <= ROW-1 & 0 <= j <= COL-1
  parent_i: number;
  parent_j: number;
  f: number;
  g: number;
  h: number;
  constructor() {
    this.parent_i = 0;
    this.parent_j = 0;
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }
}

// A Utility Function to check whether given cell (row, col)
// is a valid cell or not.
const isValid = (row: number, col: number) => {
  // Returns true if row number and column number
  // is in range
  return row >= 0 && row < ROW && col >= 0 && col < COL;
};

// A Utility Function to check whether the given cell is
// blocked or not
const isUnBlocked = (grid: number[][], row: number, col: number) => {
  // Returns true if the cell is not blocked else false
  if (grid[row][col] === 1) return true;
  else return false;
};

// A Utility Function to check whether destination cell has
// been reached or not
const isDestination = (row: number, col: number, dest: number[]) => {
  if (row === dest[0] && col === dest[1]) return true;
  else return false;
};

// A Utility Function to calculate the 'h' heuristics.
const calculateHValue = (row: number, col: number, dest: number[]) => {
  // Return using the distance formula
  return Math.sqrt(
    (row - dest[0]) * (row - dest[0]) + (col - dest[1]) * (col - dest[1]),
  );
};

// A Utility Function to trace the path from the source
// to destination
const tracePath = (
  cellDetails: {
    f: number;
    g: number;
    h: number;
    parent_i: number;
    parent_j: number;
  }[][],
  dest: number[],
) => {
  let row = dest[0];
  let col = dest[1];

  // stack<Pair> Path;
  const Path: number[][] = [];

  while (
    !(
      cellDetails[row][col].parent_i === row &&
      cellDetails[row][col].parent_j === col
    )
  ) {
    Path.push([row, col]);
    const temp_row = cellDetails[row][col].parent_i;
    const temp_col = cellDetails[row][col].parent_j;
    row = temp_row;
    col = temp_col;
  }

  Path.push([row, col]);

  return Path;
};

// A Function to find the shortest path between
// a given source cell to a destination cell according
// to A* Search Algorithm
const aStarSearch = (grid: number[][], src: number[], dest: number[]) => {
  // If the source is out of range
  if (isValid(src[0], src[1]) === false) {
    throw new HttpException('Source is invalid', HttpStatus.BAD_REQUEST);
  }

  // If the destination is out of range
  if (isValid(dest[0], dest[1]) === false) {
    throw new HttpException('Destination is invalid', HttpStatus.BAD_REQUEST);
  }

  // Either the source or the destination is blocked
  if (
    isUnBlocked(grid, src[0], src[1]) === false ||
    isUnBlocked(grid, dest[0], dest[1]) === false
  ) {
    throw new HttpException(
      'Source or the destination is blocked',
      HttpStatus.BAD_REQUEST,
    );
  }

  // If the destination cell is the same as source cell
  if (isDestination(src[0], src[1], dest) === true) {
    throw new HttpException(
      'We are already at the destination',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Create a closed list and initialise it to false which
  // means that no cell has been included yet This closed
  // list is implemented as a boolean 2D array
  const closedList = new Array(ROW);
  for (let i = 0; i < ROW; i++) {
    closedList[i] = new Array(COL).fill(false);
  }

  // Declare a 2D array of structure to hold the details
  // of that cell
  const cellDetails = new Array(ROW);
  for (let i = 0; i < ROW; i++) {
    cellDetails[i] = new Array(COL);
  }

  let i: number;
  let j: number;

  for (i = 0; i < ROW; i++) {
    for (j = 0; j < COL; j++) {
      cellDetails[i][j] = new cell();
      cellDetails[i][j].f = 2147483647;
      cellDetails[i][j].g = 2147483647;
      cellDetails[i][j].h = 2147483647;
      cellDetails[i][j].parent_i = -1;
      cellDetails[i][j].parent_j = -1;
    }
  }

  // Initialising the parameters of the starting node
  (i = src[0]), (j = src[1]);
  cellDetails[i][j].f = 0;
  cellDetails[i][j].g = 0;
  cellDetails[i][j].h = 0;
  cellDetails[i][j].parent_i = i;
  cellDetails[i][j].parent_j = j;

  /*
     Create an open list having information as-
     <f, <i, j>>
     where f = g + h,
     and i, j are the row and column index of that cell
     Note that 0 <= i <= ROW-1 & 0 <= j <= COL-1
     This open list is implemented as a set of pair of
     pair.*/
  const openList = new Map();

  // Put the starting cell on the open list and set its
  // 'f' as 0
  openList.set(0, [i, j]);

  // We set this boolean value as false as initially
  // the destination is not reached.
  let foundDest = false;

  while (openList.size > 0) {
    const p = openList.entries().next().value;

    // Remove this vertex from the open list
    openList.delete(p[0]);

    // Add this vertex to the closed list
    i = p[1][0];
    j = p[1][1];
    closedList[i][j] = true;

    /*
         Generating all the 8 successor of this cell

             N.W   N   N.E
               \   |   /
                \  |  /
             W----Cell----E
                  / | \
                /   |  \
             S.W    S   S.E

         Cell-->Popped Cell (i, j)
         N -->  North       (i-1, j)
         S -->  South       (i+1, j)
         E -->  East        (i, j+1)
         W -->  West           (i, j-1)
         N.E--> North-East  (i-1, j+1)
         N.W--> North-West  (i-1, j-1)
         S.E--> South-East  (i+1, j+1)
         S.W--> South-West  (i+1, j-1)*/

    // To store the 'g', 'h' and 'f' of the 8 successors
    let gNew: number = 0;
    let hNew: number = 0;
    let fNew: number = 0;

    //----------- 1st Successor (North) ------------

    // Only process this cell if this is a valid one
    if (isValid(i - 1, j) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i - 1, j, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i - 1][j].parent_i = i;
        cellDetails[i - 1][j].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }
      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i - 1][j] === false &&
        isUnBlocked(grid, i - 1, j) === true
      ) {
        gNew = cellDetails[i][j].g + 1;
        hNew = calculateHValue(i - 1, j, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i - 1][j].f === 2147483647 ||
          cellDetails[i - 1][j].f > fNew
        ) {
          openList.set(fNew, [i - 1, j]);

          // Update the details of this cell
          cellDetails[i - 1][j].f = fNew;
          cellDetails[i - 1][j].g = gNew;
          cellDetails[i - 1][j].h = hNew;
          cellDetails[i - 1][j].parent_i = i;
          cellDetails[i - 1][j].parent_j = j;
        }
      }
    }

    //----------- 2nd Successor (South) ------------

    // Only process this cell if this is a valid one
    if (isValid(i + 1, j) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i + 1, j, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i + 1][j].parent_i = i;
        cellDetails[i + 1][j].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }
      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i + 1][j] === false &&
        isUnBlocked(grid, i + 1, j) === true
      ) {
        gNew = cellDetails[i][j].g + 1;
        hNew = calculateHValue(i + 1, j, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i + 1][j].f === 2147483647 ||
          cellDetails[i + 1][j].f > fNew
        ) {
          openList.set(fNew, [i + 1, j]);
          // Update the details of this cell
          cellDetails[i + 1][j].f = fNew;
          cellDetails[i + 1][j].g = gNew;
          cellDetails[i + 1][j].h = hNew;
          cellDetails[i + 1][j].parent_i = i;
          cellDetails[i + 1][j].parent_j = j;
        }
      }
    }

    //----------- 3rd Successor (East) ------------

    // Only process this cell if this is a valid one
    if (isValid(i, j + 1) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i, j + 1, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i][j + 1].parent_i = i;
        cellDetails[i][j + 1].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }

      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i][j + 1] === false &&
        isUnBlocked(grid, i, j + 1) === true
      ) {
        gNew = cellDetails[i][j].g + 1;
        hNew = calculateHValue(i, j + 1, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i][j + 1].f === 2147483647 ||
          cellDetails[i][j + 1].f > fNew
        ) {
          openList.set(fNew, [i, j + 1]);

          // Update the details of this cell
          cellDetails[i][j + 1].f = fNew;
          cellDetails[i][j + 1].g = gNew;
          cellDetails[i][j + 1].h = hNew;
          cellDetails[i][j + 1].parent_i = i;
          cellDetails[i][j + 1].parent_j = j;
        }
      }
    }

    //----------- 4th Successor (West) ------------

    // Only process this cell if this is a valid one
    if (isValid(i, j - 1) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i, j - 1, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i][j - 1].parent_i = i;
        cellDetails[i][j - 1].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }

      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i][j - 1] === false &&
        isUnBlocked(grid, i, j - 1) === true
      ) {
        gNew = cellDetails[i][j].g + 1;
        hNew = calculateHValue(i, j - 1, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i][j - 1].f === 2147483647 ||
          cellDetails[i][j - 1].f > fNew
        ) {
          openList.set(fNew, [i, j - 1]);

          // Update the details of this cell
          cellDetails[i][j - 1].f = fNew;
          cellDetails[i][j - 1].g = gNew;
          cellDetails[i][j - 1].h = hNew;
          cellDetails[i][j - 1].parent_i = i;
          cellDetails[i][j - 1].parent_j = j;
        }
      }
    }

    //----------- 5th Successor (North-East)
    //------------

    // Only process this cell if this is a valid one
    if (isValid(i - 1, j + 1) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i - 1, j + 1, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i - 1][j + 1].parent_i = i;
        cellDetails[i - 1][j + 1].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }

      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i - 1][j + 1] === false &&
        isUnBlocked(grid, i - 1, j + 1) === true
      ) {
        gNew = cellDetails[i][j].g + 1.414;
        hNew = calculateHValue(i - 1, j + 1, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i - 1][j + 1].f === 2147483647 ||
          cellDetails[i - 1][j + 1].f > fNew
        ) {
          openList.set(fNew, [i - 1, j + 1]);

          // Update the details of this cell
          cellDetails[i - 1][j + 1].f = fNew;
          cellDetails[i - 1][j + 1].g = gNew;
          cellDetails[i - 1][j + 1].h = hNew;
          cellDetails[i - 1][j + 1].parent_i = i;
          cellDetails[i - 1][j + 1].parent_j = j;
        }
      }
    }

    //----------- 6th Successor (North-West)
    //------------

    // Only process this cell if this is a valid one
    if (isValid(i - 1, j - 1) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i - 1, j - 1, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i - 1][j - 1].parent_i = i;
        cellDetails[i - 1][j - 1].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }

      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i - 1][j - 1] === false &&
        isUnBlocked(grid, i - 1, j - 1) === true
      ) {
        gNew = cellDetails[i][j].g + 1.414;
        hNew = calculateHValue(i - 1, j - 1, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i - 1][j - 1].f === 2147483647 ||
          cellDetails[i - 1][j - 1].f > fNew
        ) {
          openList.set(fNew, [i - 1, j - 1]);
          // Update the details of this cell
          cellDetails[i - 1][j - 1].f = fNew;
          cellDetails[i - 1][j - 1].g = gNew;
          cellDetails[i - 1][j - 1].h = hNew;
          cellDetails[i - 1][j - 1].parent_i = i;
          cellDetails[i - 1][j - 1].parent_j = j;
        }
      }
    }

    //----------- 7th Successor (South-East)
    //------------

    // Only process this cell if this is a valid one
    if (isValid(i + 1, j + 1) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i + 1, j + 1, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i + 1][j + 1].parent_i = i;
        cellDetails[i + 1][j + 1].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }

      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i + 1][j + 1] === false &&
        isUnBlocked(grid, i + 1, j + 1) === true
      ) {
        gNew = cellDetails[i][j].g + 1.414;
        hNew = calculateHValue(i + 1, j + 1, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i + 1][j + 1].f === 2147483647 ||
          cellDetails[i + 1][j + 1].f > fNew
        ) {
          openList.set(fNew, [i + 1, j + 1]);

          // Update the details of this cell
          cellDetails[i + 1][j + 1].f = fNew;
          cellDetails[i + 1][j + 1].g = gNew;
          cellDetails[i + 1][j + 1].h = hNew;
          cellDetails[i + 1][j + 1].parent_i = i;
          cellDetails[i + 1][j + 1].parent_j = j;
        }
      }
    }

    //----------- 8th Successor (South-West)
    //------------

    // Only process this cell if this is a valid one
    if (isValid(i + 1, j - 1) === true) {
      // If the destination cell is the same as the
      // current successor
      if (isDestination(i + 1, j - 1, dest) === true) {
        // Set the Parent of the destination cell
        cellDetails[i + 1][j - 1].parent_i = i;
        cellDetails[i + 1][j - 1].parent_j = j;
        foundDest = true;
        return tracePath(cellDetails, dest);
      }

      // If the successor is already on the closed
      // list or if it is blocked, then ignore it.
      // Else do the following
      else if (
        closedList[i + 1][j - 1] === false &&
        isUnBlocked(grid, i + 1, j - 1) === true
      ) {
        gNew = cellDetails[i][j].g + 1.414;
        hNew = calculateHValue(i + 1, j - 1, dest);
        fNew = gNew + hNew;

        // If it isn’t on the open list, add it to
        // the open list. Make the current square
        // the parent of this square. Record the
        // f, g, and h costs of the square cell
        //                OR
        // If it is on the open list already, check
        // to see if this path to that square is
        // better, using 'f' cost as the measure.
        if (
          cellDetails[i + 1][j - 1].f === 2147483647 ||
          cellDetails[i + 1][j - 1].f > fNew
        ) {
          openList.set(fNew, [i + 1, j - 1]);

          // Update the details of this cell
          cellDetails[i + 1][j - 1].f = fNew;
          cellDetails[i + 1][j - 1].g = gNew;
          cellDetails[i + 1][j - 1].h = hNew;
          cellDetails[i + 1][j - 1].parent_i = i;
          cellDetails[i + 1][j - 1].parent_j = j;
        }
      }
    }
  }

  // When the destination cell is not found and the open
  // list is empty, then we conclude that we failed to
  // reach the destination cell. This may happen when the
  // there is no way to destination cell (due to
  // blockages)
  if (foundDest === false)
    throw new HttpException(
      'Failed to find the Destination Cell',
      HttpStatus.BAD_REQUEST,
    );
};

export { aStarSearch };
