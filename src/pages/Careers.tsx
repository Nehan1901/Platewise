import { Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

const Careers = () => {
  const jobs: JobPosting[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
    {
      id: "2",
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
    },
    {
      id: "3",
      title: "Business Development Manager",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time",
    },
    {
      id: "4",
      title: "Customer Support Specialist",
      department: "Support",
      location: "Remote",
      type: "Part-time",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Careers" />

      <div className="p-4 space-y-6">
        {/* Hero section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Join our mission
            </h2>
            <p className="text-sm opacity-90">
              Help us fight food waste and build a more sustainable future. We're always looking for passionate people to join our team.
            </p>
          </CardContent>
        </Card>

        {/* Open positions */}
        <div>
          <h3 className="font-semibold mb-4">Open positions</h3>

          {jobs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No open positions at the moment.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check back soon or send us your resume!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.department}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Don't see the right role?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send us your resume and tell us how you can contribute to our mission.
            </p>
            <Button variant="outline" className="w-full">
              Send Open Application
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Careers;
