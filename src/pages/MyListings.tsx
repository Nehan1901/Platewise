
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockListings = [
  {
    id: "1",
    title: "Leftover Lasagna",
    discountedPrice: 5.99,
    quantity: 3,
    status: "Active",
  },
  {
    id: "2",
    title: "Day-old Croissants",
    discountedPrice: 2.50,
    quantity: 10,
    status: "Active",
  },
  {
    id: "3",
    title: "Surplus Organic Tomatoes",
    discountedPrice: 3.00,
    quantity: 0,
    status: "Sold Out",
  },
  {
    id: "4",
    title: "Chocolate Cake Slices",
    discountedPrice: 4.00,
    quantity: 5,
    status: "Active",
  },
];

const MyListings = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your surplus food listings.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/create-listing">Create New Listing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard-business">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.title}</TableCell>
                    <TableCell>${listing.discountedPrice.toFixed(2)}</TableCell>
                    <TableCell>{listing.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={listing.status === "Active" ? "default" : "secondary"}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>
                            {listing.status === 'Active' ? 'Mark as Sold Out' : 'Mark as Available'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default MyListings;
