import VideoCamera from "@src/components/VideoCamera";
import {
  Account,
  AddTasksPage,
  CameraPage,
  CompletedLeads,
  CreateLeads,
  DashBoard,
  DevPage,
  HomePage,
  LeadsInProgress,
  LoginPage,
  MyTasksPage,
  QCCompletedLeads,
  QCHoldLeads,
  QCLeads,
  ValuatedLeads,
  ValuatePage,
  ValuationCompletedLeads,
  VehicleDetails,
  VehicleInspection,
  LandingPage,
  ChangePassword,
  KwikPrice,
} from "./src/pages";
import { LocalStorage } from "@src/Utils";
import { DRAWER_ROUTES_DISABLED_FOR_ROLEID } from "@src/constants";

export interface IRoutes {
  pathName: string;
  component: any;
  disableBack?: boolean;
  headerText?: string;
  /** @deprecated Use ExcludeHeader List instead */
  notHeaderShown?: boolean;
  shouldShow?: () => Promise<boolean>;
}

const DrawerRoutes: IRoutes[] = [
  {
    pathName: "DashBoard",
    component: DashBoard,

    // notHeaderShown: true
  },
  {
    pathName: "My Tasks",
    component: MyTasksPage,
    shouldShow: async () => {
      const usercreds = await LocalStorage.get("user_credentials");
      if (DRAWER_ROUTES_DISABLED_FOR_ROLEID.includes(usercreds.RoleId)) {
        return false;
      }
      return true;
    },
  },
  {
    pathName: "Completed Leads",
    component: CompletedLeads,
  },
  {
    pathName: "VIN Locator",
    component: DashBoard,
  },
  {
    pathName: "Kwik Price",
    component: KwikPrice,
  },
  {
    pathName: "My Account",
    component: Account,
  },
];

const StackRoutes: IRoutes[] = [
  {
    pathName: "Login",
    component: LoginPage,
  },
  {
    pathName: "LandingPage",
    component: LandingPage,
  },
  {
    pathName: "CreateLeads",
    component: CreateLeads,
  },
  {
    pathName: "Valuation",
    component: ValuatePage,
    notHeaderShown: true,
  },
  {
    pathName: "VehicleDetails",
    component: VehicleDetails,
    notHeaderShown: false,
  },
  {
    pathName: "Camera",
    component: CameraPage,
  },
  {
    pathName: "VideoCamera",
    component: VideoCamera,
  },
  {
    pathName: "ChangePassword",
    component: ChangePassword,
    headerText: "Change Password",
  },
  {
    pathName: "ValuatedLeads",
    component: ValuatedLeads,
    headerText: "Valuated Leads",
  },
  {
    pathName: "LeadsInProgress",
    component: LeadsInProgress,
    headerText: "Leads In Progress",
  },
  {
    pathName: "ValuationCompletedLeads",
    component: ValuationCompletedLeads,
    headerText: "Completed Leads",
  },
  {
    pathName: "QCCompletedLeads",
    component: QCCompletedLeads,
    headerText: "QC Completed Leads",
  },
  {
    pathName: "QCHoldLeads",
    component: QCHoldLeads,
    headerText: "QC Hold Leads",
  },
  {
    pathName: "Add Tasks",
    component: AddTasksPage,
  },
  {
    pathName: "QCLeads",
    component: QCLeads,
    headerText: "QC Leads",
  },
  ...DrawerRoutes,
];

const ExcludeHeader = [
  "Login",
  "Camera",
  "VehicleDetails",
  "LandingPage",
  "VideoCamera",
];

export { StackRoutes, DrawerRoutes, ExcludeHeader };
