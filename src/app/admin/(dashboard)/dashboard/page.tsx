import { PrismaClient } from "@prisma/client";

import { DashboardClientView } from "./dashboard-client";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  // 1. Top Stats
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const incomeTx = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "INCOME" },
  });
  const totalRevenue = incomeTx._sum.amount || 0;

  const expenseTx = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "EXPENSE", date: { gte: thirtyDaysAgo } },
  });
  const monthlyExpenses = expenseTx._sum.amount || 0;

  const rooms = await prisma.room.findMany();
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // 2. Revenue Sources (From seed data descriptions)
  const roomBookings = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "INCOME", description: { contains: "Booking" } },
  });
  const otherServices = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "INCOME", description: { not: { contains: "Booking" } } },
  });
  const revSources = [
    { name: "Room Bookings", amount: roomBookings._sum.amount || 0 },
    { name: "Restaurant & Spa", amount: otherServices._sum.amount || 0 },
  ];

  // 3. Room Allocation for Donut
  const roomAllocation = [
    { name: "Available", value: availableRooms, fill: "#4ade80" },
    { name: "Occupied", value: occupiedRooms, fill: "#f87171" },
    { name: "Maintenance/Cleaning", value: totalRooms - availableRooms - occupiedRooms, fill: "#facc15" },
  ];

  // 4. Line Chart Data (Last 7 days revenue vs expense)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const txLast7Days = await prisma.transaction.findMany({
    where: { date: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
  });

  const chartData = last7Days.map((dateStr) => {
    const dayTxs = txLast7Days.filter((tx) => tx.date.toISOString().split("T")[0] === dateStr);
    const income = dayTxs.filter((tx) => tx.type === "INCOME").reduce((sum, tx) => sum + tx.amount, 0);
    const expense = dayTxs.filter((tx) => tx.type === "EXPENSE").reduce((sum, tx) => sum + tx.amount, 0);
    return {
      date: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }),
      income,
      expense,
    };
  });

  // 5. Recent Bookings
  const recentBookings = await prisma.booking.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { guest: true, room: true },
  });

  // 6. Pending Actions (Check-ins today)
  const checkInsToday = await prisma.booking.count({
    where: {
      checkIn: {
        gte: new Date(now.setHours(0, 0, 0, 0)),
        lt: new Date(now.setHours(23, 59, 59, 999)),
      },
    },
  });

  const stats = {
    totalRevenue,
    availableRooms,
    monthlyExpenses,
    occupancyRate,
    revSources,
    roomAllocation,
    chartData,
    recentBookings,
    checkInsToday,
    totalRooms,
  };

  return <DashboardClientView data={stats} />;
}
