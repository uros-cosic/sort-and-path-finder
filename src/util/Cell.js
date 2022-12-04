export function Cell(x, y, type = "unvisited", weight = 1, distance = 0) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.start = false;
  this.target = false;
  this.weight = weight;
  this.distance = distance;

  this.isSame = (other) => {
    if (typeof other !== typeof this) return false;
    if (other.x === this.x && other.y === this.y) return true;
    return false;
  };
}
