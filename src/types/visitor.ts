export type VisitorStatus = "pending" | "checked-in" | "checked-out" | "cancelled";

export type IdType = "passport" | "driver-license" | "national-id" | "other";

export type VisitPurpose = "guest" | "delivery" | "contractor" | "service-provider" | "real-estate-agent" | "other";

export interface Visitor {
  id: string;
  visitorName: string;
  idType: IdType;
  idNumber: string;
  vehiclePlate?: string | null;
  expectedArrivalDate: string;
  expectedArrivalTime: string;
  purpose: VisitPurpose;
  unitNumber: string;
  status: VisitorStatus;
  qrCode?: string | null;
  registeredBy: string;
  checkedInAt?: string | null;
  checkedOutAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitorInput {
  visitorName: string;
  idType: IdType;
  idNumber: string;
  vehiclePlate?: string;
  expectedArrivalDate: string;
  expectedArrivalTime: string;
  purpose: VisitPurpose;
  unitNumber: string;
}

export interface UpdateVisitorStatusInput {
  id: string;
  status: Exclude<VisitorStatus, "pending">;
}
