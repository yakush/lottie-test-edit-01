type predictor = { [key: string]: boolean | (() => boolean) };

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
