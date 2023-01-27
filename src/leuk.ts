import { generateHalthyBloodValues } from './initHealthy';

export function someFn() {
  return JSON.stringify(generateHalthyBloodValues()) + " --- out --- ";
}
