
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";

const HouseholdDashboard = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Household Dashboard</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Welcome! Manage your household inventory and reduce food waste.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default HouseholdDashboard;
