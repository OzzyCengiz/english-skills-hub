/**
 * Real-world anchors. Coordinates are WGS84 and projected onto world.svg at
 * runtime; `country` must match the `name`/`class` attribute of the SVG path
 * so the map can chart the territory once the player sets foot there.
 *
 * danger: 1 (quiet) … 5 (lethal)
 */
const node = (id, lat, lon, biome, danger, country) => ({ id, lat, lon, biome, danger, country });

export const LOCATIONS = [
  // Europe & Near East
  node('istanbul', 41.01, 28.98, 'urban', 2, 'Turkey'),
  node('ankara', 39.93, 32.86, 'suburban', 2, 'Turkey'),
  node('athens', 37.98, 23.73, 'coastal', 2, 'Greece'),
  node('sofia', 42.7, 23.32, 'suburban', 2, 'Bulgaria'),
  node('bucharest', 44.43, 26.1, 'urban', 3, 'Romania'),
  node('kyiv', 50.45, 30.52, 'military', 4, 'Ukraine'),
  node('vienna', 48.21, 16.37, 'urban', 3, 'Austria'),
  node('berlin', 52.52, 13.4, 'urban', 4, 'Germany'),
  node('paris', 48.86, 2.35, 'urban', 4, 'France'),
  node('london', 51.51, -0.13, 'urban', 4, 'United Kingdom'),
  node('madrid', 40.42, -3.7, 'suburban', 3, 'Spain'),
  node('lisbon', 38.72, -9.14, 'coastal', 2, 'Portugal'),
  node('reykjavik', 64.15, -21.94, 'arctic', 2, 'Iceland'),
  node('moscow', 55.76, 37.62, 'military', 5, 'Russian Federation'),
  node('tbilisi', 41.72, 44.79, 'rural', 2, 'Georgia'),
  node('tehran', 35.69, 51.39, 'wasteland', 3, 'Iran'),
  node('beirut', 33.89, 35.5, 'coastal', 3, 'Lebanon'),

  // Africa
  node('tangier', 35.76, -5.83, 'coastal', 2, 'Morocco'),
  node('cairo', 30.04, 31.24, 'wasteland', 3, 'Egypt'),
  node('khartoum', 15.5, 32.56, 'wasteland', 3, 'Sudan'),
  node('addis_ababa', 9.03, 38.74, 'rural', 2, 'Ethiopia'),
  node('nairobi', -1.29, 36.82, 'rural', 3, 'Kenya'),
  node('timbuktu', 16.77, -3.01, 'wasteland', 2, 'Mali'),
  node('dakar', 14.72, -17.47, 'coastal', 3, 'Senegal'),
  node('lagos', 6.52, 3.38, 'urban', 4, 'Nigeria'),
  node('kinshasa', -4.44, 15.27, 'forest', 4, 'Democratic Republic of the Congo'),
  node('johannesburg', -26.2, 28.05, 'industrial', 4, 'South Africa'),
  node('cape_town', -33.92, 18.42, 'coastal', 3, 'South Africa'),

  // Asia
  node('karachi', 24.86, 67.0, 'coastal', 3, 'Pakistan'),
  node('delhi', 28.61, 77.21, 'urban', 5, 'India'),
  node('mumbai', 19.08, 72.88, 'coastal', 4, 'India'),
  node('almaty', 43.24, 76.89, 'rural', 2, 'Kazakhstan'),
  node('novosibirsk', 55.01, 82.93, 'forest', 3, 'Russian Federation'),
  node('ulaanbaatar', 47.89, 106.91, 'wasteland', 2, 'Mongolia'),
  node('beijing', 39.9, 116.4, 'urban', 5, 'China'),
  node('shanghai', 31.23, 121.47, 'industrial', 4, 'China'),
  node('seoul', 37.57, 126.98, 'urban', 4, 'Republic of Korea'),
  node('tokyo', 35.68, 139.69, 'urban', 4, 'Japan'),
  node('vladivostok', 43.12, 131.89, 'coastal', 3, 'Russian Federation'),
  node('anadyr', 64.73, 177.51, 'arctic', 3, 'Russian Federation'),
  node('bangkok', 13.76, 100.5, 'urban', 3, 'Thailand'),
  node('kuala_lumpur', 3.14, 101.69, 'forest', 3, 'Malaysia'),
  node('jakarta', -6.21, 106.85, 'urban', 4, 'Indonesia'),

  // Oceania
  node('darwin', -12.46, 130.84, 'wasteland', 2, 'Australia'),
  node('alice_springs', -23.7, 133.88, 'wasteland', 2, 'Australia'),
  node('sydney', -33.87, 151.21, 'coastal', 3, 'Australia'),
  node('auckland', -36.85, 174.76, 'coastal', 2, 'New Zealand'),

  // Americas
  node('nome', 64.5, -165.41, 'arctic', 3, 'United States'),
  node('anchorage', 61.22, -149.9, 'arctic', 2, 'United States'),
  node('vancouver', 49.28, -123.12, 'forest', 3, 'Canada'),
  node('san_francisco', 37.77, -122.42, 'coastal', 4, 'United States'),
  node('los_angeles', 34.05, -118.24, 'urban', 5, 'United States'),
  node('denver', 39.74, -104.99, 'rural', 3, 'United States'),
  node('chicago', 41.88, -87.63, 'urban', 4, 'United States'),
  node('new_york', 40.71, -74.01, 'urban', 5, 'United States'),
  node('montreal', 45.5, -73.57, 'suburban', 3, 'Canada'),
  node('st_johns', 47.56, -52.71, 'coastal', 2, 'Canada'),
  node('nuuk', 64.18, -51.72, 'arctic', 3, 'Greenland'),
  node('houston', 29.76, -95.37, 'industrial', 4, 'United States'),
  node('mexico_city', 19.43, -99.13, 'urban', 5, 'Mexico'),
  node('panama_city', 8.98, -79.52, 'forest', 3, 'Panama'),
  node('bogota', 4.71, -74.07, 'rural', 3, 'Colombia'),
  node('lima', -12.05, -77.04, 'coastal', 3, 'Peru'),
  node('manaus', -3.12, -60.02, 'forest', 4, 'Brazil'),
  node('recife', -8.05, -34.88, 'coastal', 3, 'Brazil'),
  node('sao_paulo', -23.55, -46.63, 'urban', 5, 'Brazil'),
  node('buenos_aires', -34.6, -58.38, 'urban', 4, 'Argentina'),
  node('santiago', -33.45, -70.67, 'suburban', 3, 'Chile'),
  node('ushuaia', -54.8, -68.3, 'arctic', 2, 'Argentina'),
];

/**
 * Known passable routes. `sea` crossings are slower and stormier but are the
 * only way between continents.
 */
const road = (a, b) => ({ a, b, mode: 'road' });
const sea = (a, b) => ({ a, b, mode: 'sea' });

export const ROUTES = [
  road('istanbul', 'ankara'), road('istanbul', 'sofia'), road('istanbul', 'bucharest'),
  sea('istanbul', 'athens'), road('sofia', 'athens'), road('sofia', 'bucharest'),
  road('sofia', 'vienna'), road('bucharest', 'kyiv'), road('bucharest', 'vienna'),
  road('kyiv', 'moscow'), road('kyiv', 'berlin'), road('vienna', 'berlin'),
  road('berlin', 'paris'), road('berlin', 'moscow'), road('paris', 'london'),
  road('paris', 'madrid'), road('madrid', 'lisbon'), sea('london', 'reykjavik'),
  road('ankara', 'tbilisi'), road('ankara', 'beirut'), road('tbilisi', 'tehran'),
  road('tbilisi', 'moscow'), road('beirut', 'cairo'), sea('athens', 'cairo'),

  sea('madrid', 'tangier'), sea('lisbon', 'tangier'), road('tangier', 'timbuktu'),
  road('tangier', 'dakar'), road('timbuktu', 'dakar'), road('timbuktu', 'lagos'),
  road('dakar', 'lagos'), road('cairo', 'khartoum'), road('khartoum', 'addis_ababa'),
  road('addis_ababa', 'nairobi'), road('lagos', 'kinshasa'), road('kinshasa', 'nairobi'),
  road('kinshasa', 'johannesburg'), road('nairobi', 'johannesburg'), road('johannesburg', 'cape_town'),

  road('tehran', 'karachi'), road('tehran', 'almaty'), road('karachi', 'mumbai'),
  road('karachi', 'delhi'), road('mumbai', 'delhi'), road('delhi', 'bangkok'),
  road('almaty', 'novosibirsk'), road('moscow', 'novosibirsk'), road('novosibirsk', 'ulaanbaatar'),
  road('almaty', 'beijing'), road('ulaanbaatar', 'beijing'), road('beijing', 'shanghai'),
  road('beijing', 'seoul'), road('beijing', 'vladivostok'), road('seoul', 'vladivostok'),
  sea('seoul', 'tokyo'), sea('shanghai', 'tokyo'), sea('vladivostok', 'anadyr'),
  road('shanghai', 'bangkok'), road('bangkok', 'kuala_lumpur'), sea('kuala_lumpur', 'jakarta'),

  sea('jakarta', 'darwin'), road('darwin', 'alice_springs'), road('alice_springs', 'sydney'),
  sea('sydney', 'auckland'),

  sea('anadyr', 'nome'), road('nome', 'anchorage'), road('anchorage', 'vancouver'),
  road('vancouver', 'san_francisco'), road('vancouver', 'denver'), road('san_francisco', 'los_angeles'),
  road('san_francisco', 'denver'), road('los_angeles', 'denver'), road('denver', 'chicago'),
  road('denver', 'houston'), road('chicago', 'new_york'), road('chicago', 'montreal'),
  road('new_york', 'montreal'), road('montreal', 'st_johns'), sea('st_johns', 'nuuk'),
  sea('nuuk', 'reykjavik'), road('houston', 'mexico_city'), road('mexico_city', 'panama_city'),
  road('panama_city', 'bogota'), road('bogota', 'lima'), road('bogota', 'manaus'),
  road('lima', 'santiago'), road('manaus', 'recife'), road('manaus', 'sao_paulo'),
  road('recife', 'sao_paulo'), road('sao_paulo', 'buenos_aires'), road('buenos_aires', 'santiago'),
  road('buenos_aires', 'ushuaia'), sea('dakar', 'recife'),
];

