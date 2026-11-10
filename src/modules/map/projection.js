/**
 * Robinson projection calibrated against the bundled Simplemaps world.svg
 * (viewBox 0 0 2000 857). Calibration was fitted on country bounding boxes
 * (Egypt, Iceland, Ecuador, Sri Lanka); expect ~3px error, which is far below
 * the size of a node marker.
 */

// Robinson lookup: [parallel length ratio, distance-from-equator ratio] per 5°.
const ROBINSON_TABLE = [
  [1.0000, 0.0000], [0.9986, 0.0620], [0.9954, 0.1240], [0.9900, 0.1860],
  [0.9822, 0.2480], [0.9730, 0.3100], [0.9600, 0.3720], [0.9427, 0.4340],
  [0.9216, 0.4958], [0.8962, 0.5571], [0.8679, 0.6176], [0.8350, 0.6769],
  [0.7986, 0.7346], [0.7597, 0.7903], [0.7186, 0.8435], [0.6732, 0.8936],
  [0.6213, 0.9394], [0.5722, 0.9761], [0.5322, 1.0000],
];

const MAP_ORIGIN_X = 987.3;
const MAP_EQUATOR_Y = 501.4;
const PX_PER_DEGREE_LON = 5.658;
const PX_PER_UNIT_LAT = 516.6;

export const MAP_VIEWBOX = Object.freeze({ width: 2000, height: 857 });

function robinsonCoefficients(latitude) {
  const absLat = Math.min(Math.abs(latitude), 90);
  const index = Math.min(Math.floor(absLat / 5), ROBINSON_TABLE.length - 2);
  const fraction = (absLat - index * 5) / 5;
  const [x0, y0] = ROBINSON_TABLE[index];
  const [x1, y1] = ROBINSON_TABLE[index + 1];
  return {
    lengthRatio: x0 + (x1 - x0) * fraction,
    heightRatio: (y0 + (y1 - y0) * fraction) * Math.sign(latitude),
  };
}

export function project({ lat, lon }) {
  const { lengthRatio, heightRatio } = robinsonCoefficients(lat);
  return {
    x: MAP_ORIGIN_X + lon * PX_PER_DEGREE_LON * lengthRatio,
    y: MAP_EQUATOR_Y - heightRatio * PX_PER_UNIT_LAT,
  };
}

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg) => (deg * Math.PI) / 180;

export function greatCircleKm(a, b) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

