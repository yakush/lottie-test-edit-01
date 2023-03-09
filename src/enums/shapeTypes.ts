/*global $*/
export enum shapeTypes {
  shape = "sh",
  rect = "rc",
  ellipse = "el",
  star = "sr",
  fill = "fl",
  gfill = "gf",
  gStroke = "gs",
  stroke = "st",
  merge = "mm",
  trim = "tm",
  twist = "tw",
  group = "gr",
  repeater = "rp",
  roundedCorners = "rd",
  offsetPath = "op",
  puckerAndBloat = "pb",
  zigZag = "zz",
}

export function shapeTypeToName(type: shapeTypes) {
  switch (type) {
    case "sh":
      return "shape";
    case "rc":
      return "rect";
    case "el":
      return "ellipse";
    case "sr":
      return "star";
    case "fl":
      return "fill";
    case "gf":
      return "gfill";
    case "gs":
      return "gStroke";
    case "st":
      return "stroke";
    case "mm":
      return "merge";
    case "tm":
      return "trim";
    case "tw":
      return "twist";
    case "gr":
      return "group";
    case "rp":
      return "repeater";
    case "rd":
      return "roundedCorners";
    case "op":
      return "offsetPath";
    case "pb":
      return "puckerAndBloat";
    case "zz":
      return "zigZag";
  }
  return "unknown";
}
