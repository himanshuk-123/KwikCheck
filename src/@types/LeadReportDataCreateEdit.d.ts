export interface LeadReportDataCreateedit {
  Id?: number;
  TokenID?: string;
  LeadId?: number | string;
  FuelTypeId?: number;
  ColorsTypeId?: number;
  TransmissinTypeId?: number;
  VehicleTypeModeId?: number;
  RcStatusTypeId?: number;
  Odometer?: string;
  Summary?: string;
  WheelTyresId?: number;
  ChassisTypeId?: number | string;
  TyresLifeTYpeId?: number;
  BatteryTypeId?: number;
  VehicleConditionTypeId?: number;
  PaintConditionTypeId?: number;
  Version?: null;
  IP?: string;
  Location?: null;
  ValuationPrice?: number;
  FrontExterior?: FrontExterior;
  WheelsTyres?: WheelsTyres;
  BackExterior?: BackExterior;
  LeftExterior?: LeftExterior;
  RightExterior?: RightExterior;
  EngineExterior?: EngineExterior;
  InteriorsExterior?: InteriorsExterior;
  LeadHighlights?: LeadHighlights;
  LeadHighlight?: LeadHighlights;
  LeadFeature?: LeadFeature;
  RCVahan2?: RCVahan2;
  LeadList?: LeadList;
  MMVTable?: LeadList;
  Electrical?: Electrical;
  LeadStatus?: any;
}

export interface BackExterior {
  Bumper?: string;
  Tailgate?: string;
  Taillamps?: string;
  Glass?: string;
  Undercharriage?: string;
  LeadReportDataId?: string;
  ShockAbsorber?: string;
  Lodybodyandloadfloor?: string;
  SilenCerCover?: string;
  Gaurd?: string;
  Breaks?: string;
  BackImg?: string;
  Power_Take_Off?: string;
  Hydraulic_Connection?: string;
  TowBar?: string;
  Hydraulic_Hitch?: string;
  Hydraulic_Rams?: string;
  Load_Floor?: string;
  Chassis_Vehicle_Frame?: string;
  Stabilizer_Legs?: string;
  Back_load_Lifter_Arm?: string;
  Lift_Cylinder?: string;
  BackExteriorValue?: string;
}

export interface Electrical {
  HeadLamp?: string;
  TailLamp?: string;
  FuelGauge?: string;
  Igition?: string;
}

export interface EngineExterior {
  EngineHealth?: string;
  Radiator?: string;
  Alternator?: string;
  Startermotor?: string;
  Engineroomcondition?: string;
  Suspension?: string;
  ApronBothSide?: string;
  LeadReportDataId?: number;
  Shock_Absorber?: string;
  Transmission_Condition?: string;
  Clutch_Condition?: string;
  Electric_Motor?: string;
  EngineImg?: string;
  UnderCarriage?: string;
  Differential?: string;
  Machine_Working?: string;
  EngineExteriorValue?: string;
}

export interface FrontExterior {
  Bonnet?: string;
  Bumper?: string;
  HeadLamp?: string;
  WindShiedGlass?: string;
  UnderCharriage?: string;
  LeadReportDataId?: string;
  BodyPanel?: string;
  GlassHieldFrame?: string;
  ShockAbsorber?: string;
  Fender?: string;
  Fork?: string;
  Breaks?: string;
  FrontImg?: string;
  Suspension?: string;
  Front_Axle?: string;
  Bumper_Grill?: string;
  Lift_Cylinder?: string;
  Loader_Lift_Arm?: string;
  FrontExteriorValue?: string;
}

export interface InteriorsExterior {
  Ignitionfuelfauge?: string;
  Powerwindow?: string;
  Musicsystem?: string;
  Steering?: string;
  Dashboard?: string;
  SeatCondition?: string;
  Sunroof?: string;
  LeadReportDataId?: number;
  FRONT_FLOOR?: string;
  DRIVER_SEAT?: string;
  PULL_START_LEVER?: string;
  InteriorDashBoardImg?: string;
  RunningBoard?: string;
  Gear_Shift_Play?: string;
  Hydraulic_Shift_Lever?: string;
  CO_Driver_Seat?: string;
  AC?: string;
  InteriorBackSideImgUrl?: null;
  InteriorExteriorValue?: string;
}

export interface LeadFeature {
  Keys?: string;
  VehicleCondition?: string;
  Battery?: string;
  EngineCondition?: string;
  Airbag?: string;
  ABSData?: string;
  BodyType?: null;
  CNGCylinder?: null;
}

export interface LeadHighlights {
  Engine?: string;
  Chassis?: string;
  Repunched?: string;
  PaintCondition?: string;
  BodyCondition?: string;
  OtherIssue?: string;
}

export interface LeadList {
  ProspectNo?: string;
  CustomerName?: string;
  OwnerName?: string;
  CustomerMobileNo?: string;
  MobileNo?: string;
  Vehicle?: string | number;
  VehicleCategory?: string | number;
  City?: number;
  ManufactureDate?: string;
  Manufacturedate?: string;
  ChassisNo?: string;
  chassinumber?: string;
  EngineNo?: string;
  Enginenumber?: string;
  RepoDate?: string;
  MakeCompany?: string;
  VehicleModel?: string;
}

export interface LeftExterior {
  Lhsidefender?: string;
  Pillar?: string;
  LhSideDoors?: string;
  LhQuarterPanel?: string;
  LhWindowGlass?: string;
  LeadReportDataId?: number;
  FLH_INDICATOR?: string;
  RLH_INDICATOR?: string;
  LHS_Front_Body_Panel?: string;
  LHS_Rear_Body_Panel?: string;
  Clutch_Lever?: string;
  Foot_Rest?: string;
  Gear_Pedal?: string;
  LeftImg?: string;
  Exhaust_Pipe?: string;
  Lhs_Front_Mud_Guard?: string;
  Brake_Pedal_Play?: string;
  Lhs_Rear_Fender?: string;
  Body_Panel_Condition?: string;
  LeftExteriorValue?: string;
}

export interface RCVahan2 {
  Id?: number;
  LeadId?: number | string;
  TypeId?: number;
  CustomerNo?: string;
  OwnerName?: string;
  PresentAddress?: string;
  PermanentAddress?: string;
  Financier?: string;
  Insurer?: string;
  RCRegisterNo?: string;
  RegisterRTOAddress?: string;
  RCRegistrationDate?: string;
  RCOwnerSR?: string;
  VehicleMake?: string;
  color?: string;
  chassinumber?: string;
  Enginenumber?: string;
  VehicleCategory?: string;
  VehicleClassDescription?: string;
  BodyType?: string;
  MobileNo?: string;
  RCFitnessValidity?: string;
  RCTaxValidity?: string;
  InsurancePolicyNumber?: string;
  InsuranceValidity?: string;
  RcStatus?: string;
  Manufacturedate?: string;
  VehicleModel?: string;
  Fuel?: string;
  FuelNorms?: string;
  EngineCubicCapacity?: string;
  NCRBStatus?: string;
  BlackListStatus?: string;
  NOCDetails?: string;
  PermitNo?: string;
  PermitissueDate?: string;
  PermitValidfromdate?: string;
  permitValiduptodate?: string;
  Permittype?: string;
  RCStatusasOn?: Date;
  AddedByDate?: Date;
  Status?: number;
  RtoCode?: string;
  MakeCompany?: string;
  WheelBase?: string;
  Unladenweight?: string;
  Frossweight?: string;
  NoofCylinder?: string;
  Seatingcapacity?: string;
  SleeperCapacity?: string;
  StandingCapacity?: string;
  Emissionnorms?: string;
  RcFatherName?: string;
  PermitValidFrom?: string;
  PUCCNo?: string;
  PUCCUpto?: string;
}

export interface RightExterior {
  Rhsidefender?: string;
  Pillar?: string;
  Rhsidedoors?: string;
  RhQuarterPanel?: string;
  RhWindowGlass?: string;
  LeadReportDataId?: number;
  RHS_Front_Body_Panel?: string;
  RHS_Rear_Body_Panel?: string;
  Frh_Indicator?: string;
  Rrh_Indicator?: string;
  Fuel_Tank?: string;
  Silencer?: string;
  RightImg?: string;
  FuelTank?: string;
  Rhs_Front_Mud_Guard?: string;
  Accelerator_Pedal_Play?: string;
  Rhs_Rear_Fender?: string;
  Window_Glass?: string;
  Body_Panel_Condition?: string;
  RightExteriorValue?: string;
}

export interface WheelsTyres {
  Numberoftyres?: number;
  TyresLife?: string;
  Fronttyre?: string;
  Rearrighttyre?: string;
  Rearlefttyre?: string;
  Reartyre?: string;
}

export interface LeadReportDataCreateeditResponse {
  ERROR?: string;
  STATUS?: string;
  MESSAGE?: string;
  DataList?: null;
}
