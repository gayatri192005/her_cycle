
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import LogForm from '@/components/LogForm';

const Log = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/dashboard" className="flex items-center text-foreground/70 hover:text-foreground">
              <ArrowLeft size={18} className="mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <h1 className="text-2xl font-bold tracking-tight">Log Entry</h1>
          <p className="text-muted-foreground">
            Track your period, symptoms, and mood.
          </p>
        </div>
        
        <LogForm />
      </div>
    </div>
  );
};

export default Log;
