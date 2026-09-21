import prisma from "@/lib/db";

import { DashboardClientView } from "./dashboard-client";


export default async function DashboardPage() {
  // 1. Top Stats
  const now = new Date();
  
  const rooms = await prisma.room.findMany();
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;

  const unreadMessages = await prisma.contactMessage.count({
    where: { isRead: false },
  });
  
  const pendingReviews = await prisma.review.count({
    where: { isApproved: false },
  });

  const totalGuests = await prisma.guest.count();

  // 2. Room Allocation for Donut
  const roomAllocation = [
    { name: "Available", value: availableRooms, fill: "#4ade80" },
    { name: "Occupied", value: occupiedRooms, fill: "#f87171" },
    { name: "Maintenance/Cleaning", value: totalRooms - availableRooms - occupiedRooms, fill: "#facc15" },
  ];

  // 3. Line Chart Data (Last 7 days revenue vs expense)
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

  // 4. Recent Bookings
  const recentBookings = await prisma.booking.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { guest: true, room: true },
  });

  // 5. Today's Check-ins
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));
  
  const checkInsToday = await prisma.booking.findMany({
    where: {
      checkIn: {
        gte: todayStart,
        lt: todayEnd,
      },
    },
    include: { guest: true, room: true },
    take: 5,
  });

  const stats = {
    unreadMessages,
    availableRooms,
    pendingReviews,
    totalGuests,
    roomAllocation,
    chartData,
    recentBookings,
    checkInsToday,
    totalRooms,
  };

  return <DashboardClientView data={stats} />;
}
