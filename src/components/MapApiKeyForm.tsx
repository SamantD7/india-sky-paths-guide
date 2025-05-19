
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { storeMapApiKey } from "@/utils/mapUtils";

interface MapApiKeyFormProps {
  onKeySet: () => void;
}

const MapApiKeyForm = ({ onKeySet }: MapApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) return;
    
    setLoading(true);
    
    // Store API key in localStorage
    storeMapApiKey(apiKey.trim());
    
    // Small delay to simulate processing
    setTimeout(() => {
      setLoading(false);
      onKeySet();
    }, 500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Maps API Key Required</CardTitle>
        <CardDescription>
          To visualize flight routes, please enter your Google Maps API key.
          This key will be stored in your browser's local storage and never sent to any server.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Maps API key" 
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                You can get a key from the <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!apiKey.trim() || loading} className="w-full">
            {loading ? "Saving..." : "Set API Key"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MapApiKeyForm;
