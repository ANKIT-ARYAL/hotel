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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardData {
  unreadMessages: number;
  availableRooms: number;
  pendingReviews: number;
  totalGuests: number;
  roomAllocation: { name: string; value: number; fill: string }[];
  chartData: { date: string; income: number; expense: number }[];
  recentBookings: any[];
  checkInsToday: any[];
  totalRooms: number;
}

export function DashboardClientView({ data }: { data: DashboardData }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

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
        <Link href="/admin/messages">
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-500 font-normal">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-semibold text-gray-900">{data.unreadMessages}</div>
                  <div className="text-sm text-gray-500 mt-1">New guest inquiries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/rooms">
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
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
        </Link>

        <Link href="/admin/reviews">
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-500 font-normal">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-semibold text-gray-900">{data.pendingReviews}</div>
                  <div className="text-sm text-gray-500 mt-1">Require approval</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/guests">
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-semibold text-gray-900">{data.totalGuests}</div>
                  <div className="text-sm text-gray-500 mt-1">Registered guests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Second Row: Charts layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Revenue Overview (Last 7 Days)</CardTitle>
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

        {/* Right Column (Spans 1) */}
        <div className="space-y-6">
          <Card className="shadow-sm h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Room Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center h-[250px] justify-between">
                <div className="w-full h-[150px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.roomAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
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

                <div className="w-full flex flex-col justify-center space-y-2 mt-4 pt-4 border-t border-gray-100">
                  {data.roomAllocation.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-gray-500">
                        <span className="w-1.5 h-3 rounded-sm mr-2" style={{ backgroundColor: item.fill }} />
                        {item.name}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{item.value}</span>
                        <span className="font-semibold text-gray-400 w-8 text-right">
                          {data.totalRooms > 0 ? Math.round((item.value / data.totalRooms) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
            <Link href="/admin/bookings" className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.recentBookings.length > 0 ? (
              data.recentBookings.map((b: any, i: number) => (
                <Link
                  key={i}
                  href={`/admin/bookings`}
                  className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors p-2 -mx-2 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-base text-gray-900">
                      {b.guest?.name || "Unknown"} • {b.room?.number || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{formatCurrency(b.totalAmount)}</div>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                    {b.room?.type?.substring(0, 2) || "RM"}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-gray-500 text-sm text-center py-4">No recent bookings</div>
            )}
          </CardContent>
        </Card>

        {/* Today's Check-ins */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Todays Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            {data.checkInsToday.length > 0 ? (
              <div className="space-y-4">
                {data.checkInsToday.map((b: any, i: number) => (
                  <Link
                    key={i}
                    href={`/admin/bookings`}
                    className="border border-gray-100 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 mr-3 flex items-center justify-center font-bold text-gray-600">
                        {b.guest?.name?.substring(0, 1) || "?"}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900">{b.guest?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">Room {b.room?.number || "N/A"}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[150px] text-gray-500">
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <span className="text-xl">☀️</span>
                </div>
                <p>No check-ins scheduled for today.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

