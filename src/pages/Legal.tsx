import { Scale, FileText, Shield, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import BottomNav from "@/components/shared/BottomNav";

interface LegalItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const Legal = () => {
  const legalItems: LegalItem[] = [
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Our terms and conditions for using PlateWise",
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "How we collect, use, and protect your data",
    },
    {
      icon: FileText,
      title: "Cookie Policy",
      description: "Information about cookies and tracking",
    },
    {
      icon: Scale,
      title: "Community Guidelines",
      description: "Rules and guidelines for our community",
    },
    {
      icon: FileText,
      title: "Licenses",
      description: "Open source licenses and attributions",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Legal" />

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {legalItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
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
            <p className="text-sm text-muted-foreground">
              PlateWise v1.0.0
            </p>
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
