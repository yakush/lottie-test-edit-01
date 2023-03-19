type predictor = { [key: string]: boolean | (() => boolean) };

function bounds(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

export function rgbToHex(r: number, g: number, b: number, a?: number) {
  r = r != null ? bounds(r, 0, 255) : r;
  g = g != null ? bounds(g, 0, 255) : g;
  b = b != null ? bounds(b, 0, 255) : b;
  a = a != null ? bounds(a, 0, 255) : a;

  let num = (1 << 24) + (r << 16) + (g << 8) + (b << 0);

  let str = `#${num.toString(16).slice(1)}`;

  if (a != null) {
    str = str + Math.round(a).toString(16);
  }

  return str;
}

export function hexToRgb(hex?: string) {
  let result: RegExpExecArray | null = null;

  if (!hex) {
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
