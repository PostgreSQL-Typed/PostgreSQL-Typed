declare module "jsprim" {
  export function parseInteger(
    octet: string,
    options: { base: number }
  ): number | Error;
}
