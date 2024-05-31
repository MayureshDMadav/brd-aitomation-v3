import { GetFormStats } from "@/actions/form";
import { LuView } from "react-icons/lu";
import { ReactNode, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCard = ({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  helperText: string;
  loading: boolean;
  className: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {!loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
};

const StatsCards = (props: StatsCardProps) => {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid gird-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time for Visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />
      <StatsCard
        title="Total Submissions"
        icon={<LuView className="text-yellow-600" />}
        helperText="Total Number of Form Submitted"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="Submissions Rate"
        icon={<LuView className="text-green-600" />}
        helperText="Total Rate of Form Submission"
        value={data?.submissionRate.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-green-600"
      />
      <StatsCard
        title="Bounce Rate"
        icon={<LuView className="text-red-600" />}
        helperText="Number of Form Discarded"
        value={data?.submissionRate.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
};

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
    </div>
  );
}

const CardStatsWrapper = async () => {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
};


interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}
