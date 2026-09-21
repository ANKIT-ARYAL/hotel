/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, RoomStatus, BookingStatus, TransactionType } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');
  
  // 1. Roles & Admin
  const hashedPassword = await bcrypt.hash('adminpassword', 10)
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', permissions: ['ALL'] },
  })

  await prisma.role.upsert({
    where: { name: 'RECEPTIONIST' },
    update: { permissions: ['Reception', 'Dashboard', 'Bookings', 'Messages', 'Rooms', 'Guests', 'Reviews'] },
    create: { name: 'RECEPTIONIST', permissions: ['Reception', 'Dashboard', 'Bookings', 'Messages', 'Rooms', 'Guests', 'Reviews'] },
  })

  await prisma.role.upsert({
    where: { name: 'USER' },
    update: { permissions: [] },
    create: { name: 'USER', permissions: [] },
  })
  
  await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      password: hashedPassword,
      name: 'Hotel Admin',
      roleId: adminRole.id,
    },
  })
  
  // 2. Amenities
  const amenitiesData = [
    { name: 'AC', icon: 'thermometer' },
    { name: 'Free WiFi', icon: 'wifi' },
    { name: 'TV', icon: 'tv' },
    { name: 'Breakfast Included', icon: 'coffee' },
    { name: 'Geyser', icon: 'droplets' },
    { name: 'Parking', icon: 'car' }
  ]
  const amenities: any[] = []
  for (const a of amenitiesData) {
    const am = await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a
    })
    amenities.push(am)
  }

  // 3. Room Categories
  const categoryData = [
    { name: 'Standard Room', basePrice: 100, description: 'Comfortable basic room.' },
    { name: 'Premium Room', basePrice: 150, description: 'Spacious room with better view.' },
    { name: 'Townhouse', basePrice: 200, description: 'Luxurious townhouse experience.' },
    { name: 'Flagship', basePrice: 250, description: 'Our top tier flagship offering.' }
  ]
  const categories: any[] = []
  for (const c of categoryData) {
    const cat = await prisma.roomCategory.upsert({
      where: { name: c.name },
      update: {},
      create: {
        ...c,
        amenities: {
          connect: amenities.slice(0, 3).map(a => ({ id: a.id }))
        }
      }
    })
    categories.push(cat)
  }
  
  // 4. Rooms
  const rooms: any[] = []
  for (let i = 101; i <= 120; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)]
    const r = Math.random()
    const status = r < 0.6 ? 'AVAILABLE' : r < 0.8 ? 'OCCUPIED' : r < 0.9 ? 'CLEANING' : 'MAINTENANCE'
    
    const room = await prisma.room.upsert({
      where: { number: String(i) },
      update: {},
      create: {
        number: String(i),
        categoryId: cat.id,
        status,
        price: cat.basePrice + (Math.random() > 0.5 ? 10 : 0),
        description: `A lovely ${cat.name}.`
      }
    })
    rooms.push(room)
  }
  
  // 5. Guests
  const guestsData = [
    { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
    { name: 'Robert Johnson', email: 'robert@example.com', phone: '345-678-9012' },
  ]
  
  const guests: any[] = []
  for (const g of guestsData) {
    const guest = await prisma.guest.upsert({
      where: { email: g.email },
      update: {},
      create: g
    })
    guests.push(guest)
  }

  // 6. Promotions
  await prisma.promotion.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: { code: 'WELCOME50', discountValue: 50, isPercentage: true }
  })
  
  // 7. Bookings, Transactions & Reviews
  const bookingCount = await prisma.booking.count()
  if (bookingCount === 0) {
    for (let i = 0; i < 20; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)]
      const guest = guests[Math.floor(Math.random() * guests.length)]
      
      const now = new Date()
      const checkIn = new Date()
      checkIn.setDate(now.getDate() + (Math.floor(Math.random() * 40) - 20))
      const checkOut = new Date(checkIn)
      checkOut.setDate(checkIn.getDate() + Math.floor(Math.random() * 5) + 1)
      
      const status = checkOut < now ? 'CHECKED_OUT' : checkIn <= now ? 'CHECKED_IN' : 'CONFIRMED'
      const nights = Math.max(1, Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
      const totalAmount = room.price * nights
      
      const booking = await prisma.booking.create({
        data: {
          guestId: guest.id,
          roomId: room.id,
          checkIn,
          checkOut,
          totalAmount,
          status
        }
      })

      // Add a transaction
      await prisma.transaction.create({
        data: {
          amount: totalAmount,
          type: 'INCOME',
          description: 'Payment for booking ' + booking.id,
          gateway: 'eSewa',
          bookingId: booking.id
        }
      })

      // Add a review if checked out
      if (status === 'CHECKED_OUT') {
        await prisma.review.create({
          data: {
            guestId: guest.id,
            bookingId: booking.id,
            rating: Math.floor(Math.random() * 2) + 4,
            comment: 'Great stay!',
            isApproved: true
          }
        })
      }
    }
  }

  // 8. Analytics
  const analyticsCount = await prisma.analyticsEvent.count()
  if (analyticsCount === 0) {
    const categories = ['PAGE_VIEW', 'BOOKING_ATTEMPT', 'CONVERSION']
    const names = ['Dashboard View', 'Room Search', 'Checkout Started']
    const now = new Date()
    for (let i = 0; i < 20; i++) {
      const date = new Date()
      date.setDate(now.getDate() - Math.floor(Math.random() * 30))
      await prisma.analyticsEvent.create({
        data: {
          name: names[Math.floor(Math.random() * names.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          value: Math.floor(Math.random() * 100),
          date
        }
      })
    }
  }

  console.log('Seeding complete!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
