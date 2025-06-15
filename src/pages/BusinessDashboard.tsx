
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";

const BusinessDashboard = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Business Dashboard</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Welcome! Manage your listings and view your orders.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default BusinessDashboard;
