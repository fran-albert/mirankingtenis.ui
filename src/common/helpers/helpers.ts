export function capitalizeWords(input: any) {
    return input.toLowerCase().replace(/(?:^|\s)\S/g, function (a: any) { return a.toUpperCase(); });
  }