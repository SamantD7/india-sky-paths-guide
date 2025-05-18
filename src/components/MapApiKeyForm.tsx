
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface MapApiKeyFormProps {
  onKeySet: () => void;
}

const MapApiKeyForm = ({ onKeySet }: MapApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Check if we already have the API key in localStorage
    const savedKey = localStorage.getItem("map_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Use a demo key if the user didn't enter anything
    const keyToSave = apiKey.trim() || "demo_key_for_sky_path";
    
    localStorage.setItem("map_api_key", keyToSave);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved",
    });
    onKeySet();
  };

  const handleSkip = () => {
    // Use a demo key for development/testing
    localStorage.setItem("map_api_key", "demo_key_for_sky_path");
    toast({
      title: "Using Demo Key",
      description: "Using a demo key for development purposes",
    });
    onKeySet();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Maps API Key</CardTitle>
        <CardDescription>
          Enter your Google Maps API key to enable the interactive map features
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                id="apiKey"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For this demo, you can continue without an actual API key
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button type="submit">
            Save Key
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MapApiKeyForm;
