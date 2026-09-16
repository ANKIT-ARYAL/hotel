import { PrismaClient } from '@prisma/client'
import { AnalyticsClientView } from './analytics-client'

const prisma = new PrismaClient()

export default async function AnalyticsPage() {
  const events = await prisma.analyticsEvent.findMany({
    orderBy: { date: 'desc' }
  })
  
  return <AnalyticsClientView initialEvents={events} />
}
