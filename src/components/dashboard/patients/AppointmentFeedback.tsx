import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Appointment } from '@/types/patient';

interface AppointmentFeedbackProps {
  appointment: Appointment;
  onSubmit: (feedback: {
    rating: number;
    comment: string;
    wouldRecommend: boolean;
    waitTime: number;
    doctorCommunication: number;
    facilityRating: number;
  }) => void;
  onCancel: () => void;
}

export const AppointmentFeedback: React.FC<AppointmentFeedbackProps> = ({
  appointment,
  onSubmit,
  onCancel
}) => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    wouldRecommend: true,
    waitTime: 3,
    doctorCommunication: 3,
    facilityRating: 3
  });

  const handleSubmit = () => {
    onSubmit(feedback);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Appointment Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="icon"
                  onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                  className={feedback.rating >= star ? 'text-yellow-500' : 'text-muted-foreground'}
                >
                  <Star className="h-6 w-6" />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Would you recommend this doctor?</Label>
            <div className="flex gap-4">
              <Button
                variant={feedback.wouldRecommend ? 'default' : 'outline'}
                onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: true }))}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                Yes
              </Button>
              <Button
                variant={!feedback.wouldRecommend ? 'default' : 'outline'}
                onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: false }))}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                No
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Wait Time</Label>
            <RadioGroup
              value={feedback.waitTime.toString()}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, waitTime: parseInt(value) }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="wait-1" />
                <Label htmlFor="wait-1">Too Long</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="wait-2" />
                <Label htmlFor="wait-2">Long</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="wait-3" />
                <Label htmlFor="wait-3">Average</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="wait-4" />
                <Label htmlFor="wait-4">Short</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="wait-5" />
                <Label htmlFor="wait-5">Very Short</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Doctor Communication</Label>
            <RadioGroup
              value={feedback.doctorCommunication.toString()}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, doctorCommunication: parseInt(value) }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="comm-1" />
                <Label htmlFor="comm-1">Poor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="comm-2" />
                <Label htmlFor="comm-2">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="comm-3" />
                <Label htmlFor="comm-3">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="comm-4" />
                <Label htmlFor="comm-4">Very Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="comm-5" />
                <Label htmlFor="comm-5">Excellent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Facility Rating</Label>
            <RadioGroup
              value={feedback.facilityRating.toString()}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, facilityRating: parseInt(value) }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="facility-1" />
                <Label htmlFor="facility-1">Poor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="facility-2" />
                <Label htmlFor="facility-2">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="facility-3" />
                <Label htmlFor="facility-3">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="facility-4" />
                <Label htmlFor="facility-4">Very Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="facility-5" />
                <Label htmlFor="facility-5">Excellent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Additional Comments</Label>
            <Textarea
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 