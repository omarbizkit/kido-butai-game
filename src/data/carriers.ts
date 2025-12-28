import { JapaneseCarrier } from '../types';

export interface CarrierHistoricalData {
  name: string;
  type: string;
  hullNumber: string;
  commander: string;
  description: string;
  historicalFate: string;
  stats: {
    displacement: string;
    length: string;
    speed: string;
    aircraft: string;
  };
}

export const CARRIER_DATA: Record<JapaneseCarrier, CarrierHistoricalData> = {
  AKAGI: {
    name: 'Akagi',
    type: 'Fleet Carrier',
    hullNumber: '赤城',
    commander: 'Captain Taijiro Aoki',
    description: 'Flagship of the Kido Butai. Originally laid down as an Amagi-class battlecruiser, she was converted into a carrier following the Washington Naval Treaty.',
    historicalFate: 'Struck by one 1,000 lb bomb from Lt. Cdr. Richard Best of Enterprise. The hit ignited fueled and armed B5N torpedo bombers on the hangar deck. Scuttled by Japanese destroyers on June 5, 1942.',
    stats: {
      displacement: '36,500 tons',
      length: '260.67 m',
      speed: '31.5 knots',
      aircraft: '66 (+25 reserve)',
    }
  },
  KAGA: {
    name: 'Kaga',
    type: 'Fleet Carrier',
    hullNumber: '加賀',
    commander: 'Captain Jisaku Okada',
    description: 'One of Japan\'s largest carriers, known for her massive horizontal funnel. She was a converted Tosa-class battleship.',
    historicalFate: 'Struck by four bombs from Enterprise SBDs. One bomb hit the bridge, killing most of the senior officers. The ship was engulfed in uncontrollable fires and sank in the evening of June 4, 1942.',
    stats: {
      displacement: '38,200 tons',
      length: '247.65 m',
      speed: '28 knots',
      aircraft: '72 (+18 reserve)',
    }
  },
  HIRYU: {
    name: 'Hiryū',
    type: 'Fleet Carrier',
    hullNumber: '飛龍',
    commander: 'Captain Tomeo Kaku',
    description: 'A Soryu-class derivative with an unusual port-side island. Known for her high speed and agile maneuvering.',
    historicalFate: 'The lone survivor of the morning strikes, Hiryu launched two heroic counterattacks that crippled USS Yorktown. She was eventually struck by four bombs from Enterprise SBDs and scuttled the next morning.',
    stats: {
      displacement: '17,300 tons',
      length: '227.35 m',
      speed: '34 knots',
      aircraft: '63 (+9 reserve)',
    }
  },
  SORYU: {
    name: 'Sōryū',
    type: 'Fleet Carrier',
    hullNumber: '蒼龍',
    commander: 'Captain Ryusaku Yanagimoto',
    description: 'The first purpose-built fleet carrier of the Imperial Japanese Navy. Sleek and fast, she served as the design basis for Hiryu.',
    historicalFate: 'Struck by three bombs from USS Yorktown SBDs. The bombs decimated the hangar deck, causing massive secondary explosions. She sank rapidly in the afternoon of June 4, 1942.',
    stats: {
      displacement: '15,900 tons',
      length: '227.5 m',
      speed: '34.5 knots',
      aircraft: '63 (+9 reserve)',
    }
  }
};
