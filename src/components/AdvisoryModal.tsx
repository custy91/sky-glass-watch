
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvisoryModal: React.FC<AdvisoryModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [advisoryContent, setAdvisoryContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const generateAdvisory = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleAdvisory = `WEATHER ADVISORY - URGENT

ISSUED: ${new Date().toLocaleString()}

CURRENT CONDITIONS:
Severe weather conditions are affecting multiple airport operations in the region. Strong winds exceeding 35 mph with gusts up to 50 mph are creating hazardous conditions for aircraft operations.

AFFECTED AIRPORTS:
- JFK International Airport: Winds 38 mph, gusts 48 mph, visibility 3 miles
- LaGuardia Airport: Winds 42 mph, gusts 52 mph, visibility 2.5 miles
- Newark Liberty International: Winds 35 mph, gusts 45 mph, visibility 4 miles

FLIGHT IMPACT:
- Delays expected for all departures and arrivals
- Possible flight diversions due to crosswind limitations
- Ground stop may be implemented if conditions worsen

RECOMMENDATIONS:
1. Passengers should check with airlines for flight status updates
2. Allow extra time for travel to airports
3. Consider postponing non-essential flights
4. Monitor weather updates regularly

DURATION:
These conditions are expected to persist for the next 4-6 hours with gradual improvement expected after 18:00 UTC.

NEXT UPDATE: 
Advisory will be updated in 2 hours or sooner if conditions change significantly.

For real-time updates, contact your airline or check airport websites.

END OF ADVISORY`;

    setAdvisoryContent(sampleAdvisory);
    setIsGenerating(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate publishing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Advisory Published",
      description: "The weather advisory has been successfully published to all stakeholders.",
    });
    
    setIsPublishing(false);
    onClose();
    setAdvisoryContent('');
  };

  const handleClose = () => {
    onClose();
    setAdvisoryContent('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>Weather Advisory Generator</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!advisoryContent ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Generate a comprehensive weather advisory based on current conditions
              </p>
              <Button 
                onClick={generateAdvisory} 
                disabled={isGenerating}
                className="min-w-[200px]"
              >
                {isGenerating ? 'Generating...' : 'Generate Advisory'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Generated Advisory</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAdvisory}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Regenerating...' : 'Regenerate'}
                </Button>
              </div>
              
              <Textarea
                value={advisoryContent}
                onChange={(e) => setAdvisoryContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Advisory content will appear here..."
              />
            </div>
          )}
        </div>

        {advisoryContent && (
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isPublishing ? 'Publishing...' : 'Publish Advisory'}</span>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdvisoryModal;
