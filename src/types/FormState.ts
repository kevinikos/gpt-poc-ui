export type Destination = {
  name: string;
  iso: string;
};

export type EditedDestination = Destination & { index: number };
