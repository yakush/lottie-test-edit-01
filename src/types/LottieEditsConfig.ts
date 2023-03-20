import { ColorRef } from "../utils/lottieUtils";
import { LottieLayer, TextLayer } from "./LottieLayer";

type Color = string;

export type LayerRef = {
  assetId?: string;
  ind: number;
};

export interface LottieEditsConfig {
  colorEdits?: ColorsEditsConfig;
  layerEdits?: LayerEditsConfig[];
  textEdits?: TextEditsConfig[];
}

//-------------------------------------------------------

export interface ColorsEditsConfig {
  scheme: {
    name: string;
    description: string;
    origColorStr: Color;
    _targets?: ColorRef[];
  }[];
  options?: {
    name: string;
    description: string;
    colors: Color[];
  }[];
  _edited?: {
    selectedOption: number; //-1 for user defined
    userDefinedColors: Color[];
  };
}

//-------------------------------------------------------

export interface LayerEditsConfig {
  name: string;
  description: string;
  defaultOption?: number;
  allowNone?: boolean;

  options: {
    name: string;
    description: string;
    refs: LayerRef[];
    _targets?: LottieLayer[];
  }[];

  _edited?: {
    selectedOption: number; //-1 for none
  };
}

//-------------------------------------------------------

export interface TextEditsConfig {
  name: string;
  description: string;
  ref: LayerRef;
  _target?: TextLayer;

  _edited?: {
    origText: string;
    selectedText: string;
  };
}

//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------

let test: LottieEditsConfig = {
  colorEdits: {
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

  layerEdits: [
    {
      name: "group1",
      description: "group 1 is main char",
      defaultOption: 0,
      options: [
        {
          name: "option 1",
          description: "options is 1",
          refs: [
            {
              assetId: "comp_0",
              ind: 1,
            },
            {
              ind: 1,
            },
          ],
        },
        {
          name: "option 2",
          description: "options is 2",
          refs: [
            {
              assetId: "comp_0",
              ind: 2,
            },
            {
              ind: 4,
            },
          ],
        },
      ],
    },
    {
      name: "group2",
      description: "group 2 is another char",
      defaultOption: 0,
      allowNone: true,
      options: [
        {
          name: "option 1",
          description: "options is 1",
          refs: [
            {
              assetId: "comp_0",
              ind: 1,
            },
            {
              ind: 2,
            },
          ],
        },
        {
          name: "option 2",
          description: "options is 2",
          refs: [
            {
              assetId: "comp_0",
              ind: 1,
            },
            {
              ind: 1,
            },
          ],
        },
      ],
    },
    {
      name: "group3",
      description: "group 3 is another char !",
      defaultOption: 0,
      allowNone: true,
      options: [
        {
          name: "option 1",
          description: "options is 1",
          refs: [
            {
              assetId: "comp_0",
              ind: 1,
            },
            {
              ind: 2,
            },
          ],
        },
      ],
    },
  ],
  textEdits: [
    {
      name: "text1",
      description: "text one is good",
      ref: {
        ind: 5,
      },
    },
    {
      name: "text2",
      description: "text two is good too",
      ref: {
        ind: 3,
      },
    },
  ],
};
