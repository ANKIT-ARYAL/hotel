import React from 'react';
import { Navbar } from '@/components/homepage/Navbar';
import { FooterSection } from '@/components/homepage/FooterSection';
import { getHomepageSettings } from '@/app/actions/homepage-settings';
import { searchAvailableRooms } from '@/app/actions/search';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { arrival?: string; departure?: string; guests?: string };
}) {
  const { arrival, departure, guests } = searchParams;
  const settings = await getHomepageSettings();
  const { available, recommendations } = await searchAvailableRooms(
    arrival || null,
    departure || null,
    guests || null
  );

  const formatDisplayDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const hasSearch = arrival && departure;

  return (
    <div className="min-h-screen flex flex-col">
      {/* We need a darker navbar background for a light page, or we use a dark header block */}
      <div className="relative bg-zinc-900 pb-20 pt-32 px-6 lg:px-24 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-50">
          <source src={settings.searchHero?.videoUrl || "/uploads/1789297793949-797680564.mp4"} type="video/mp4" />
        </video>
        <div className="relative z-20">
          <Navbar />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto mt-12">
          <h1 className="font-nove text-4xl md:text-6xl text-white mb-4">
            {hasSearch ? 'Your Search Results' : 'Explore Our Collections'}
          </h1>
          {hasSearch && (
            <p className="text-zinc-300 font-oklean text-lg">
              Showing availability for {formatDisplayDate(arrival)} - {formatDisplayDate(departure)}
            </p>
          )}
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16">
        
        {/* Results Block */}
        {available.length > 0 && (
          <div className="mb-20">
            <h2 className="font-argine text-3xl md:text-4xl text-zinc-900 mb-10">Available Accommodations</h2>
            <div className="grid grid-cols-1 gap-12">
              {available.map((category) => (
                <div key={category.id} className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50 flex flex-col md:flex-row group">
                  <div className="w-full md:w-5/12 aspect-video md:aspect-auto relative overflow-hidden">
                    <img 
                      src={category.images[0]?.url || '/uploads/room-1.jpg'} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-argine text-3xl font-bold text-zinc-900">{category.name}</h3>
                      <div className="text-right shrink-0 ml-4">
                        <span className="block text-2xl font-bold text-zinc-900">${category.basePrice}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Per Night</span>
                      </div>
                    </div>
                    <p className="text-zinc-600 font-oklean leading-relaxed mb-8">
                      {category.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-3 mb-10">
                      {category.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity.id} className="flex items-center text-sm text-zinc-600 font-medium">
                          <Check className="w-4 h-4 mr-3 text-zinc-900" />
                          {amenity.name}
                        </div>
                      ))}
                    </div>

                    <Button className="w-full md:w-fit bg-zinc-900 text-white hover:bg-zinc-800 h-14 px-10 rounded-full font-medium tracking-wide transition-all shadow-xl shadow-zinc-200">
                      Reserve Now
                      <ArrowRight className="w-4 h-4 ml-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Recommendations */}
        {hasSearch && available.length === 0 && (
          <div className="mb-20 text-center py-16 bg-white rounded-3xl shadow-sm border border-zinc-100">
            <h2 className="font-argine text-4xl text-zinc-900 mb-4">No Availability Found</h2>
            <p className="text-zinc-500 font-oklean max-w-lg mx-auto mb-8">
              We're sorry, but we are fully booked for those exact dates. Please consider adjusting your travel dates or explore our recommended collections below.
            </p>
            <Link href="/">
              <Button variant="outline" className="h-12 px-8 rounded-full border-zinc-300">
                Change Search Dates
              </Button>
            </Link>
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="font-argine text-3xl md:text-4xl text-zinc-900 mb-10">
              {hasSearch && available.length === 0 ? 'Highly Recommended Alternatives' : 'Featured Collections'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map((category) => (
                <div key={category.id} className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-zinc-200/50 group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={category.images[0]?.url || '/uploads/room-1.jpg'} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-argine text-xl font-bold text-zinc-900 mb-2">{category.name}</h3>
                    <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-900">${category.basePrice} <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-normal">/ Night</span></span>
                      <Button variant="outline" size="sm" className="rounded-full border-zinc-300">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {settings.footer.isVisible && <FooterSection settings={settings.footer} />}
    </div>
  );
}
