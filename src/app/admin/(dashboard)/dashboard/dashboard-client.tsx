/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";

import {
  ArrowRight,
  ChevronDown,
  Clock,
  Download,
  Droplet,
  MoreHorizontal,
  QrCode,
  RefreshCw,
  Send,
  Settings,
  Smartphone,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";

interface DashboardData {
  totalRevenue: number;
  availableRooms: number;
  monthlyExpenses: number;
  occupancyRate: number;
  revSources: { name: string; amount: number }[];
  roomAllocation: { name: string; value: number; fill: string }[];
  chartData: { date: string; income: number; expense: number }[];
  recentBookings: unknown[];
  checkInsToday: number;
  totalRooms: number;
}

export function DashboardClientView({ data }: { data: DashboardData }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const totalRevSource = data.revSources.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Hotel Finances
          </h1>
          <p className="text-base text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex space-x-6 mt-6">
            <Link href="/admin/dashboard" className="font-semibold text-gray-900 border-b-2 border-gray-900 pb-2">
              Dashboard
            </Link>
            <Link href="/admin/rooms" className="font-medium text-gray-500 pb-2 hover:text-gray-900 transition-colors">
              Rooms
            </Link>
            <Link
              href="/admin/bookings"
              className="font-medium text-gray-500 pb-2 hover:text-gray-900 transition-colors"
            >
              Bookings
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <span className="text-sm text-gray-500 flex items-center">
            <RefreshCw className="w-3 h-3 mr-1" /> Updated just now
          </span>
        </div>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-semibold text-gray-900">{formatCurrency(data.totalRevenue)}</div>
                <div className="text-sm text-gray-500 mt-1">Total accumulated revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-semibold text-gray-900">{data.availableRooms}</div>
                <div className="text-sm text-gray-500 mt-1">Out of {data.totalRooms} total rooms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-semibold text-gray-900">{formatCurrency(data.monthlyExpenses)}</div>
                <div className="text-sm text-gray-500 mt-1">Expenses in the last 30 days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-semibold text-gray-900">{data.occupancyRate}%</div>
                <div className="text-sm text-gray-500 mt-1">Current live occupancy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Complex layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
              <Button variant="outline" size="sm" className="h-8 text-sm font-normal">
                Weekly <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      dy={10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#1f2937"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Revenue Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mt-2">
                {data.revSources.map((source, i) => {
                  const percentage = totalRevSource > 0 ? Math.round((source.amount / totalRevSource) * 100) : 0;
                  return (
                    <div key={i} className="flex-1 relative border-l-2 border-dashed border-gray-200 pl-4">
                      <div className="text-sm text-gray-500 mb-1">
                        {source.name} • {percentage}%
                      </div>
                      <div className="text-xl font-semibold mb-3">{formatCurrency(source.amount)}</div>
                      <div className="h-4 w-full bg-gray-500 rounded-sm opacity-80" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Room Allocation</CardTitle>
              <Button variant="outline" size="sm" className="h-8 text-sm font-normal">
                All Rooms <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center h-[200px]">
                <div className="w-1/2 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.roomAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.roomAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="text-lg font-bold">{data.totalRooms}</span>
                  </div>
                </div>

                <div className="w-1/2 flex flex-col justify-center space-y-4 pl-4 border-l border-gray-100">
                  {data.roomAllocation.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-base">
                      <div className="flex flex-col">
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="w-1.5 h-3 rounded-sm mr-2" style={{ backgroundColor: item.fill }} />
                          {item.name}
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 ml-3.5">{item.value}</span>
                      </div>
                      <span className="font-semibold">{Math.round((item.value / data.totalRooms) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.recentBookings.map((b: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-semibold text-base text-gray-900">
                    {b.guest.name} • {b.room.number}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{formatCurrency(b.totalAmount)}</div>
                </div>
                <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                  {b.room?.type?.substring(0, 2) || "RM"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-3xl font-semibold text-gray-900">{data.checkInsToday}</div>
              <div className="text-base text-gray-500 mt-1">Check-ins expected today</div>
            </div>

            <div className="space-y-3">
              <div className="border border-gray-100 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">⚙️</div>
                  <div>
                    <div className="text-base font-semibold text-gray-900">System Status</div>
                    <div className="text-sm text-gray-500">All systems operational</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Shortcuts */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Quick Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input placeholder="Guest Email" className="flex-1 bg-gray-50 border-gray-200" />
                <Button className="bg-gray-900 text-white hover:bg-gray-800">Create</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <QrCode className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">Scan QR</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <Send className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">Invoice</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <Wallet className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">Billing</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">History</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">Mobile</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <Zap className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">Energy</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <Droplet className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">Water</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 hover:bg-gray-50 cursor-pointer">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-500">More</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
