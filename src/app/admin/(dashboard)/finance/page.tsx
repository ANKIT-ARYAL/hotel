import { PrismaClient } from '@prisma/client'
import { FinanceClientView } from './finance-client'

const prisma = new PrismaClient()

export default async function FinancePage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' }
  })
  
  return <FinanceClientView initialTransactions={transactions} />
}
