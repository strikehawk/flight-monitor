export const EARTH_RADIUS = 6378137;
export const EARTH_DIAMETER = 2 * Math.PI * EARTH_RADIUS;

export function getMetersPerPixel(zoom: number): number {
    return EARTH_DIAMETER / Math.pow(2, zoom);
}
