import { useNavigate } from "react-router-dom";
import { Scale, FileText, Shield, ChevronRight, ScrollText, Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface LegalItem {
  icon: React.ElementType;
  title: string;
  description: string;
  slug: string;
}

const Legal = () => {
  const navigate = useNavigate();

  const legalItems: LegalItem[] = [
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Our terms and conditions for using PlateWise",
      slug: "terms-of-service",
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data",
      slug: "privacy-policy",
    },
    {
      icon: ScrollText,
      title: "Cookie Policy",
      description: "Information about cookies and tracking",
      slug: "cookie-policy",
    },
    {
      icon: Users2,
      title: "Community Guidelines",
      description: "Rules and guidelines for our community",
      slug: "community-guidelines",
    },
    {
      icon: FileText,
      title: "Licenses",
      description: "Open source licenses and attributions",
      slug: "licenses",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Legal" />

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {legalItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.slug}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/legal/${item.slug}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">PlateWise v1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2024 PlateWise. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Legal;
