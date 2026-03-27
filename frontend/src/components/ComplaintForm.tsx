import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CATEGORIES } from "@/data/mock";

interface Ward {
  id: string;
  ward_name: string;
}

export function ComplaintForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [wards, setWards] = useState<Ward[]>([]);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');
  const { toast } = useToast();
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_URL}/api/v1/wards`)
      .then(res => res.json())
      .then(data => setWards(data))
      .catch(err => console.error("Failed to fetch wards", err));
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocating(false);
      },
      error => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. You can enter coordinates manually.');
          return;
        }
        setLocationError('Unable to fetch current location. Please try again or enter manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      let photo_url = undefined;
      const file = formData.get("photo") as File;
      if (file && file.size > 0) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const uploadRes = await fetch(`${API_URL}/api/v1/complaints/upload`, {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const resJson = await uploadRes.json();
          photo_url = resJson.photo_url;
        }
      }

      const rawText = formData.get("raw_text") as string;
      const wardId = formData.get("ward") as string;
      const category = formData.get("category") as string;

      const selectedWard = wards.find(w => w.id === wardId);
      const wardName = selectedWard ? selectedWard.ward_name : 'Not specified';

      const gpsContext = latitude && longitude ? `, GPS: ${latitude}, ${longitude}` : ', GPS: Not provided';
      const enhancedText = `${rawText}\n\n[Context - Ward: ${wardName}, Selected Category: ${category || 'Not specified'}${gpsContext}]`;

      const complaintData = {
        citizen_name: formData.get("citizen_name"),
        citizen_phone: formData.get("citizen_phone"),
        channel: "web",
        raw_text: enhancedText,
        ward_id: wardId || null,
        photo_url,
        category: category || "Unclassified",
      };

      const res = await fetch(`${API_URL}/api/v1/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      if (!res.ok) throw new Error("Failed to submit request");
      
      const result = await res.json();

      toast({
        title: "Complaint Submitted",
        description: `Your ticket ID is ${result.ticket_id}. Save this for future reference.`,
      });

      if (onSuccess) onSuccess();
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-1 py-2">
      <div className="space-y-2">
        <Label htmlFor="citizen_name">Full Name</Label>
        <Input id="citizen_name" name="citizen_name" placeholder="E.g., Ananya Singh" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="citizen_phone">Phone Number <span className="text-destructive">*</span></Label>
        <Input id="citizen_phone" name="citizen_phone" required placeholder="+91 XXXXXXXXXX" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward">Ward / Area</Label>
          <Select name="ward">
            <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
            <SelectContent>
              {wards.map(w => <SelectItem key={w.id} value={w.id}>{w.ward_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category">
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="raw_text">Description <span className="text-destructive">*</span></Label>
        <Textarea 
          id="raw_text" 
          name="raw_text" 
          required 
          placeholder="Describe your issue in detail (min 20 characters)" 
          minLength={20} 
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border/60 p-3 bg-muted/20">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm font-medium">GPS Location (Recommended)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={locating}
          >
            {locating ? 'Fetching location...' : 'Use Current Location'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="latitude" className="text-xs text-muted-foreground">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              placeholder="e.g. 28.613939"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="longitude" className="text-xs text-muted-foreground">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              placeholder="e.g. 77.209021"
            />
          </div>
        </div>

        {locationError && <p className="text-xs text-destructive">{locationError}</p>}
        {!locationError && latitude && longitude && (
          <p className="text-xs text-muted-foreground">Location captured: {latitude}, {longitude}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Attach Photo (Optional)</Label>
        <Input id="photo" name="photo" type="file" accept="image/*" className="cursor-pointer file:text-primary file:font-medium" />
      </div>
      <Button type="submit" className="w-full text-md font-semibold mt-4 h-12 transition-transform active:scale-[0.98]" disabled={loading}>
        {loading ? "Submitting securely..." : "Submit Complaint"}
      </Button>
    </form>
  );
}
