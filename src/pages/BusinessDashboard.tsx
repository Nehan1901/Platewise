
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, PlusCircle, User } from "lucide-react";

const BusinessDashboard = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Business Dashboard</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Welcome! Manage your profile, listings, and orders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Profile
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Setup or update your business details.
                </p>
                <Button asChild>
                  <Link to="/business-profile">Manage Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Create Listing
                </CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Add a new surplus item to your listings.
                </p>
                <Button asChild>
                  <Link to="/create-listing">Add New Listing</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Listings
                </CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  View and manage all your listings.
                </p>
                <Button asChild>
                  <Link to="/my-listings">View Listings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default BusinessDashboard;
