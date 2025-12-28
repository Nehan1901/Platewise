import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

const PageHeader = ({ title, rightAction }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
        {rightAction || <div className="w-10" />}
      </div>
    </header>
  );
};

export default PageHeader;
