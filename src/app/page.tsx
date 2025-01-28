import ProductScanner from '@/components/ProductScanner'
import EcoChat from '@/components/EcoChat'
import EcoMap from '@/components/EcoMap'
import Header from '@/components/Header'
import EcoRewards from '@/components/EcoRewards'
import WeeklySummary from '@/components/WeeklySummary'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProductScanner />
        <div className="space-y-8">
          <EcoChat />
          <WeeklySummary />
        </div>
        <EcoRewards />
        <div className="lg:col-span-3">
          <EcoMap />
        </div>
      </div>
    </main>
  )
}