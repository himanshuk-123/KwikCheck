/**
 * Card Name to API Field Name Mapping
 * This file maps the card names shown on the Valuation screen 
 * to their corresponding API field names used for server upload
 */

const CARD_API_MAPPING: Record<string, string> = {
  // Format: "Card Display Name": "ApiFieldName"
  // Core
  "Odometer Reading": "Odometer",
  Dashboard: "Dashboard",
  "Interior Back Side": "InteriorBack",
  "Engine Image": "Engine",
  "Chassis Imprint Image": "ChassisImprint",
  "Chassis Plate Image": "ChassisPlate",

  // Exteriors
  "Front Side Image": "FrontImage",
  "Right Side Image": "RightImage",
  "Back Side Image": "BackImage",
  "Left Side Image": "LeftImage",

  // Tyres (backend expects a consolidated field)
  "Front Right Tyre Image": "Tyre",
  "Rear Right Tyre Image": "Tyre",
  "Rear Left Tyre Image": "Tyre",
  "Front Left Tyre Image": "Tyre",
  "Front Tyre Image": "Tyre",
  "Rear Tyre Image": "Tyre",

  // Selfie / RC
  "Valuator Selfie With Vehicle": "Selfie",
  "Valuator Selfie with vehicle": "Selfie",
  "Rc Front Image": "RCFront",
  "RC Front Image": "RCFront",
  "Rc Back Image": "RCBack",
  "RC Back Image": "RCBack",

  // Optional
  "Optional-1": "Other1",
  "Optional-2": "Other2",
  "Optional-3": "Other3",

  // Fallbacks/aliases
  "Front Side": "FrontImage",
  "Right Side": "RightImage",
  "Back Side": "BackImage",
  "Left Side": "LeftImage",
  Selfie: "Selfie",
  Video: "Video",
};

/**
 * Get the API field name for a given card name
 * @param cardName - The display name of the card (e.g., "Odometer Reading")
 * @returns The corresponding API field name (e.g., "Odometer")
 */
export const getApiFieldName = (cardName: string): string => {
  return CARD_API_MAPPING[cardName] || cardName;
};

export default CARD_API_MAPPING;
