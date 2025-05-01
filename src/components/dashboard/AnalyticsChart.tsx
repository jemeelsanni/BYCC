import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { AnalyticsDataPoint, OrderStatusData, formatPrice } from '../../types/dashboard';

interface AnalyticsChartProps {
    data: AnalyticsDataPoint[];
    period: string;
    ordersByStatus: OrderStatusData[];
}

const COLORS = ['#BD3A3A', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, period, ordersByStatus }) => {
    const renderCustomizedLabel = ({
        name,
        percent
    }: {
        name: string;
        percent: number;
    }) => {
        const displayName = window.innerWidth < 768 && name.length > 6
            ? `${name.substring(0, 6)}...`
            : name;
        return `${displayName} ${(percent * 100).toFixed(0)}%`;
    };

    const formatTooltipValue = (value: number, name: string) => {
        if (name === "Revenue") return formatPrice(value);
        return value;
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue & Orders Line Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-2 order-1">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
                    Sales Analytics - {period.charAt(0).toUpperCase() + period.slice(1)}
                </h2>
                <div className="h-64 sm:h-72 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 30
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                tick={{ fontSize: 10 }}
                                tickMargin={5}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#BD3A3A"
                                width={50}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#8884d8"
                                width={40}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString()}
                            />
                            <Tooltip
                                formatter={formatTooltipValue}
                                contentStyle={{ fontSize: '12px' }}
                                itemStyle={{ padding: '2px 0' }}
                            />
                            <Legend
                                iconSize={8}
                                wrapperStyle={{
                                    fontSize: '12px',
                                    paddingTop: '10px'
                                }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#BD3A3A"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                name="Revenue"
                                dot={{ strokeWidth: 1, r: 2 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="orders"
                                stroke="#8884d8"
                                strokeWidth={2}
                                name="Orders"
                                dot={{ strokeWidth: 1, r: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 order-2">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
                    Orders by Status
                </h2>
                <div className="h-64 sm:h-72 md:h-80">
                    {ordersByStatus.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ordersByStatus}
                                    innerRadius={40}
                                    outerRadius="70%"
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                    label={renderCustomizedLabel}
                                    labelLine={false}
                                >
                                    {ordersByStatus.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [`${value} orders`, 'Count']}
                                    contentStyle={{ fontSize: '12px' }}
                                    itemStyle={{ padding: '2px 0' }}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    iconSize={8}
                                    wrapperStyle={{
                                        fontSize: '10px',
                                        paddingTop: '10px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-500 text-sm sm:text-base">
                                No order data available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsChart;