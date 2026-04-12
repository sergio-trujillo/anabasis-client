// Company landing — shows the active 4 F1 sample exercises (one per type).
// F2 will replace this with a loop roadmap + countdown header.

import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { bilingual } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";

const TYPE_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  mcq: "default",
  code: "secondary",
  "open-prompt": "outline",
  "interviewer-chat": "default",
};

export function CompanyPage() {
  const { t } = useTranslation();
  const { companySlug = "" } = useParams();
  const companyQuery = trpc.companies.get.useQuery({ slug: companySlug });
  const exercisesQuery = trpc.exercises.list.useQuery();

  return (
    <AppLayout>
      <div className="px-6 py-10 max-w-3xl mx-auto w-full">
        {companyQuery.isPending && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        )}

        {companyQuery.error && (
          <p className="text-destructive">{companyQuery.error.message}</p>
        )}

        {companyQuery.data && (
          <header className="mb-10">
            <h1 className="text-3xl font-bold font-heading">{companyQuery.data.company.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {companyQuery.data.company.tagline}
            </p>
          </header>
        )}

        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
          {t("company.samplesHeader")}
        </h2>

        {exercisesQuery.isPending && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        )}

        {exercisesQuery.data && (
          <ul className="space-y-2">
            {exercisesQuery.data.map((ex) => (
              <li key={ex.id}>
                <Link to={`/${companySlug}/exercise/${ex.id}`}>
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-sm font-medium font-heading">
                          {bilingual(ex.title)}
                        </CardTitle>
                        <Badge variant={TYPE_VARIANT[ex.type] ?? "default"}>
                          {t(`exercise.types.${ex.type}`)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="hidden">
                      <p />
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
