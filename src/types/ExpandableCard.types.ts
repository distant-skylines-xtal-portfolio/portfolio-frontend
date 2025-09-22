export type cardDimensionsType = {
    center: {x: number, y: number};
    width: number,
    height: number,
    top: number,
    left: number,
    connectionPoints: {
        top: {x:number, y:number},
        bottom: {x:number, y:number},
        left: {x:number, y:number},
        right: {x:number, y:number},
    }
}

export type Point = {
  x: number,
  y: number
}

export type ExpandableCardMethods = {
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  isExpanded: () => boolean;
};

export type Connection = {
  from: Point;
  to: Point;
  animated?: boolean;
  onComplete?: () => void;
};

export {};