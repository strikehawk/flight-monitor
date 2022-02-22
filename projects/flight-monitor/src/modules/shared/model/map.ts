/**
 * A world coordinates set, in EPSG:4326, as decimal degrees.
 */
export type GeoLocation = [number, number, number?];

/**
 * A world extent, in EPSG:4326, as decimal degrees. Coordinates follow the minx, miny, maxx, maxy order.
 */
export type BoundingBox = [number, number, number, number];
