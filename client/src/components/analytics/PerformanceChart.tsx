import { useMemo } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { QuizAttempt } from "@/types/quiz";
import { format } from "date-fns";

interface PerformanceChartProps {
    attempts: QuizAttempt[];
}

const chartConfig = {
    score: {
        label: "Score (%)",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function PerformanceChart({ attempts }: PerformanceChartProps) {
    const chartData = useMemo(() => {
        return attempts
            .slice()
            .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
            .map((attempt) => ({
                date: format(new Date(attempt.submittedAt), "MMM d, HH:mm"),
                score: Math.round((attempt.score / attempt.totalQuestions) * 100),
                fullDate: format(new Date(attempt.submittedAt), "PPP p"),
                quizTitle: attempt.quiz?.title || "Quiz",
            }));
    }, [attempts]);

    if (attempts.length < 2) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Track your progress over time</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground text-center p-6">
                    <div className="space-y-2">
                        <p className="font-medium text-lg">Not enough data yet</p>
                        <p className="text-sm">Complete at least two quizzes to see your performance trend.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{
                            left: -20,
                            right: 12,
                            top: 10,
                            bottom: 10,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-score)"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-score)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => value}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="score"
                            type="monotone"
                            fill="url(#fillScore)"
                            fillOpacity={0.4}
                            stroke="var(--color-score)"
                            strokeWidth={3}
                            stackId="a"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
