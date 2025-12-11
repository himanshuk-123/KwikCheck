/** Used for Mapping of Image upload API */
export const AllApiAcceptedKeys: Record<string, string> = {
  "Front Side Image": "FrontImgBase64",
  "Back Side Image": "BackImgBase64",
  "Left Side Image": "LeftImgBase64",
  "Right side Image": "RightImgBase64",
  "Right Side Image": "RightImgBase64",
  "Engine Image": "EngineImgBase64",
  Dashboard: "InteriorDashBoardImgBase64",
  "Interior Back Side": "InteriorBackSideImgBase64",
  "Odmeter Reading": "OdomerterBase64",
  "RC Front Image": "RCFrontBase64",
  "Rc Front Image": "RCFrontBase64",
  "Chassis Plate Image": "ChassisPlateBase64",
  "RC Back Image": "RCBackBase64",
  "Rc Back Image": "RCBackBase64",
  // "": "Other1Base64",
  // "": "Other2Base64",
  // "": "Other3Base64",
  // "": "Other4Base64",
  // "": "Other5Base64",
  "Chassis Imprint Image": "ChassisImPrintBase64",
  "Front Tyre Image": "Tyre1Base64",
  "Rear Tyre Image": "Tyre2Base64",
  "Front Right Tyre Image": "Tyre1Base64",
  "Rear Right Tyre Image": "Tyre4Base64",
  "Rear Left Tyre Image": "Tyre3Base64",
  // "": "Tyre3Base64",
  // "": "Tyre4Base64",
  // "": "Tyre5Base64",
  // "": "Tyre6Base64",
  // "": "Tyre7Base64",
  // "": "Tyre8Base64",
  "Valuator Selfie with vehicle": "ValuatorSelfieWithVehicleBase64",
  "Valuator Selfie With Vehicle": "ValuatorSelfieWithVehicleBase64",
  "Top View Image": "ElectricalImgBase64",
  "Optional-1": "Other1Base64",
  "Optional-2": "Other2Base64",
  "Optional-3": "Other3Base64",
  "Optional-4": "Other4Base64",
  "Optional-5": "Other5Base64",
  "Optional-6": "Other6Base64",
  "Optional-7": "Other7Base64",
  "Optional-8": "Other8Base64",
  Profile: "ProfileImageBase64",
  // "": "Video1Base64",
  Electrical: "ElectricalImgBase64",
};

/** Mapping of tyres for different vehicle types */
export const TYRE_MAPPING = {
  "2W": [
    {
      name: "Front Tyre Image",
      number: "Tyre1Base64",
      Life: "TyreLife1",
    },
    {
      name: "Rear Tyre Image",
      number: "Tyre3Base64",
      Life: "TyreLife3",
    },
  ],
  "3W": [
    {
      name: "Front Tyre Image",
      number: "Tyre1Base64",
      Life: "TyreLife1",
    },
    {
      name: "Rear Left Tyre Image",
      number: "Tyre3Base64",
      Life: "TyreLife3",
    },
    {
      name: "Rear Right Tyre Image",
      number: "Tyre4Base64",
      Life: "TyreLife4",
    },
  ],
  "4W": [
    {
      name: "Front Left Tyre Image",
      number: "Tyre1Base64",
      Life: "TyreLife1",
    },
    {
      name: "Front Right Tyre Image",
      number: "Tyre2Base64",
      Life: "TyreLife2",
    },
    {
      name: "Rear Right Tyre Image",
      number: "Tyre3Base64",
      Life: "TyreLife3",
    },
    {
      name: "Rear Left Tyre Image",
      number: "Tyre4Base64",
      Life: "TyreLife4",
    },
  ],
  FE: [
    {
      name: "Front Left Tyre Image",
      number: "Tyre1Base64",
      Life: "TyreLife1",
    },
    {
      name: "Front Right Tyre Image",
      number: "Tyre2Base64",
      Life: "TyreLife2",
    },
    {
      name: "Rear Right Tyre Image",
      number: "Tyre3Base64",
      Life: "TyreLife3",
    },
    {
      name: "Rear Left Tyre Image",
      number: "Tyre4Base64",
      Life: "TyreLife4",
    },
  ],
  CV: [
    {
      name: "Front Left Tyre Image",
      number: "Tyre1Base64",
      Life: "TyreLife1",
    },
    {
      name: "Front Right Tyre Image",
      number: "Tyre2Base64",
      Life: "TyreLife2",
    },
    {
      name: "Rear Right Tyre Image",
      number: "Tyre3Base64",
      Life: "TyreLife3",
    },
    {
      name: "Rear Left Tyre Image",
      number: "Tyre4Base64",
      Life: "TyreLife4",
    },
  ],
  CE: [
    {
      name: "Front Left Tyre Image",
      number: "Tyre1Base64",
      Life: "TyreLife1",
    },
    {
      name: "Front Right Tyre Image",
      number: "Tyre2Base64",
      Life: "TyreLife2",
    },
    {
      name: "Rear Right Tyre Image",
      number: "Tyre3Base64",
      Life: "TyreLife3",
    },
    {
      name: "Rear Left Tyre Image",
      number: "Tyre4Base64",
      Life: "TyreLife4",
    },
  ],
};

// DocumentUpload API accepted param keys
export const ApiAcceptedKeys = [
  "FrontImg",
  "BackImg",
  "LeftImg",
  "RightImg",
  "EngineImg",
  "InteriorDashBoardImg",
];
