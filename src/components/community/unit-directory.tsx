"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Unit, UnitStatus } from "./unit-card";

interface UnitDirectoryProps {
  units: Unit[];
}

type StatusFilter = UnitStatus | "all";

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

export function UnitDirectory({ units }: UnitDirectoryProps) {
  const t = useTranslations("community.units");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesSearch = unit.unitNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || unit.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [units, searchQuery, statusFilter]);

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: t("filter.all") },
    { value: "occupied", label: t("filter.occupied") },
    { value: "vacant", label: t("filter.vacant") },
    { value: "maintenance", label: t("filter.maintenance") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:hidden">
        {filteredUnits.map((unit) => (
          <Card key={unit.id}>
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
        ))}
      </div>

      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle>{t("directory.title")}</CardTitle>
          <CardDescription>{t("directory.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUnits.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-medium">{t("noUnits")}</p>
              <p className="text-sm text-muted-foreground">
                {t("noUnitsDescription")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.unitNumber")}</TableHead>
                  <TableHead>{t("table.floor")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.occupant")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      {unit.unitNumber}
                    </TableCell>
                    <TableCell>{unit.floor}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(unit.status)}>
                        {t(`status.${unit.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>{unit.occupantName || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {filteredUnits.length === 0 && (
        <div className="py-12 text-center lg:hidden">
          <p className="text-lg font-medium">{t("noUnits")}</p>
          <p className="text-sm text-muted-foreground">
            {t("noUnitsDescription")}
          </p>
        </div>
      )}
    </div>
  );
}
