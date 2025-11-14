import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { createApiClient } from "@/lib/api";

const TripDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const api = createApiClient({ token });
  const [trip, setTrip] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<{ trip: any }>(`/api/trips/${id}`).then((r) => setTrip(r.trip)).catch(() => setTrip(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Trip Details</h1>
          {!trip && <div className="text-muted-foreground">Loading trip…</div>}
          {trip && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="text-xl font-semibold">{trip.title}</div>
                <div className="text-sm text-muted-foreground">Location: {trip.location || '—'}</div>
              </Card>
              {trip.itinerary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trip.itinerary.days?.map((d: any) => (
                    <Card key={d.day} className="p-4">
                      <div className="font-semibold mb-2">Day {d.day}</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {d.activities.map((a: string, i: number) => <li key={i}>{a}</li>)}
                      </ul>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TripDetails;


