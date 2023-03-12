type predictor = { [key: string]: boolean | (() => boolean) };

export function rgbToHex(
  r: number,
  g: number,
  b: number,
  a?: number 
) {
  let num = (1 << 24) + (r << 16) + (g << 8) + (b << 0);

  if (a != null) {
    num = (num << 8) + a;
  }

  return `#${num.toString(16).slice(1)}`;
}

export function hexToRgb(hex?: string) {
  let result: RegExpExecArray | null = null;

  if (!hex){
    return null;
  }

  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return result.map((i) => parseInt(i, 16)).slice(1);
  }

  result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
  if (result) {
    return result.map((i) => parseInt(i, 16)).slice(1);
  }

  result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return result.map((i) => parseInt(i, 16)).slice(1);
  }

  result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
  if (result) {
    return result.map((i) => parseInt(i, 16)).slice(1);
  }

  return null;
}

export function joinClasses(...classes: (string | predictor)[]) {
  let resolvedClasses: string[] = [];

  classes
    .filter((item) => item != null)
    .forEach((item) => {
      if (typeof item === "string") {
        resolvedClasses.push(item);
        return;
      }
      if (typeof item === "object") {
        for (const propName in item) {
          let shouldInclude = item[propName];
          if (typeof shouldInclude === "function") {
            shouldInclude = shouldInclude();
          }
          if (shouldInclude) {
            resolvedClasses.push(propName);
          }
        }
        return;
      }
    });

  return resolvedClasses.join(" ");
}
