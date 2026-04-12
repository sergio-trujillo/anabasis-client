// Catalog landing page — localized Spanish-first via i18next.

import { LockIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export function CatalogPage() {
  const { t } = useTranslation();
  const { data, isPending, error } = trpc.companies.list.useQuery();

  return (
    <AppLayout>
      <div className="px-6 py-10 max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight font-heading">
            {t("catalog.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("brand.tagline")}</p>
        </header>

        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t("catalog.chooseCampaign")}
        </h2>

        {isPending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-destructive text-sm">
            {t("catalog.errorLoading")}: {error.message}
          </p>
        )}

        {data && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((company) => {
              const isActive = company.status === "active";
              const card = (
                <Card
                  className={
                    isActive
                      ? "h-full hover:border-primary/50 transition-colors cursor-pointer"
                      : "h-full opacity-50"
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-heading text-base">{company.name}</CardTitle>
                      {isActive ? (
                        <Badge
                          style={{
                            backgroundColor: company.accentColor,
                            color: "#fff",
                          }}
                        >
                          {t("catalog.active")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <LockIcon className="size-3" />
                          {t("catalog.soon")}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{company.tagline}</p>
                  </CardContent>
                </Card>
              );
              return (
                <li key={company.slug}>
                  {isActive ? <Link to={`/${company.slug}`}>{card}</Link> : card}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
