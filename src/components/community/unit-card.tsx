"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export type UnitStatus = "occupied" | "vacant" | "maintenance";

export interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  status: UnitStatus;
  occupantName?: string;
}

interface UnitCardProps {
  unit: Unit;
}

function getStatusVariant(status: UnitStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "occupied":
      return "default";
    case "vacant":
      return "outline";
    case "maintenance":
      return "destructive";
    default:
      return "default";
  }
}

export function UnitCard({ unit }: UnitCardProps) {
  const t = useTranslations("community.units");

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold">
            {t("card.unitLabel")} {unit.unitNumber}
          </CardTitle>
          <Badge variant={getStatusVariant(unit.status)}>
            {t(`status.${unit.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("card.floor")}</span>
          <span className="font-medium">{unit.floor}</span>
        </div>
        {unit.occupantName && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("card.occupant")}</span>
            <span className="font-medium">{unit.occupantName}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
