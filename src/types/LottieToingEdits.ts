type Color = string;
type LayerRef = string;

export interface LottieToingEdits {
  colors: ColorsEdits;
  layerOptions: LayerOption[];
}
//-------------------------------------------------------
export interface ColorsEdits {
  scheme: {
    name: string;
    description: string;
    origColorStr: Color;
  }[];
  options?: {
    name: string;
    description: string;
    colors: Color[];
  }[];
}
//-------------------------------------------------------
export interface LayerOption {
  name: string;
  description: string;
  defaultOption?: number;
  options: {
    name: string;
    description: string;
    refs: LayerRef[];
  }[];
}

//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

let test: LottieToingEdits = {
  colors: {
    scheme: [
      {
        name: "color A",
        description: "color AAAA",
        origColorStr: "#0f0f0f",
      },
      {
        name: "color B",
        description: "color BBB",
        origColorStr: "#0f0f0f",
      },
    ],
    options: [
      {
        name: "palate a",
        description: "palate a is nice",
        colors: ["#aaaaaa", "#bbbbbb"],
      },
      {
        name: "palate b",
        description: "palate a is nice",
        colors: ["#a0a0a0", "#b0b0b0"],
      },
    ],
  },
  layerOptions: [
    {
      name: "group1",
      description: "group 1 is main char",
      defaultOption: 0,
      options: [
        {
          name: "option 1",
          description: "options is 1",
          refs: ["layer1", "layer2"],
        },
        {
          name: "option 2",
          description: "options is 2",
          refs: ["layer11", "layer12"],
        },
      ],
    },
    {
      name: "group2",
      description: "group 2 is another char",
      defaultOption: 0,
      options: [
        {
          name: "option 1",
          description: "options is 1",
          refs: ["layer44", "layer42"],
        },
        {
          name: "option 2",
          description: "options is 2",
          refs: ["layer144", "layer142"],
        },
      ],
    },
  ],
};
