import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, Brain, Sparkles, AlertTriangle } from 'lucide-react';
import apiService from '@/services/api';

interface AICompanionProps {
  patientId: string;
}

export function AICompanion({ patientId }: AICompanionProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [analysis, setAnalysis] = useState<{
    recommendations: string[];
    warnings: string[];
    costAnalysis: {
      currentCost: number;
      potentialSavings: number;
      alternatives: Array<{
        name: string;
        cost: number;
        effectiveness: 'high' | 'medium' | 'low';
      }>;
    };
  } | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Call the ML model API
      const response = await apiService.analyzePrescriptionWithAI({
        patientId,
        message: userMessage,
        chatHistory
      });

      setChatHistory(prev => [...prev, { role: 'assistant', content: response.analysis }]);
      setAnalysis({
        recommendations: response.recommendations,
        warnings: response.warnings,
        costAnalysis: response.costAnalysis
      });
    } catch (error) {
      console.error('Error analyzing prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze prescription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialMessage = () => {
    return "Hello! I'm your AI health companion. I can help you with:\n\n" +
      "• Understanding your medications\n" +
      "• Analyzing potential side effects\n" +
      "• Providing cost-saving alternatives\n" +
      "• Answering health-related questions\n\n" +
      "How can I assist you today?";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Companion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {chatHistory.length === 0 && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <p className="whitespace-pre-line">{getInitialMessage()}</p>
                    </div>
                  </div>
                </div>
              )}
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {msg.role === 'assistant' && (
                        <Bot className="h-4 w-4" />
                      )}
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Ask about your prescription or health..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Medication Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Recommendations</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                      {analysis.warnings.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2 text-yellow-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Warnings
                          </h3>
                          <ul className="list-disc pl-4 space-y-1">
                            {analysis.warnings.map((warning, index) => (
                              <li key={index} className="text-sm text-yellow-600">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold mb-2">Cost Analysis</h3>
                        <div className="space-y-2">
                          <p className="text-sm">Current Cost: ${analysis.costAnalysis.currentCost.toFixed(2)}</p>
                          <p className="text-sm">Potential Savings: ${analysis.costAnalysis.potentialSavings.toFixed(2)}</p>
                          {analysis.costAnalysis.alternatives.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">Alternative Options:</p>
                              <ul className="list-disc pl-4 space-y-1">
                                {analysis.costAnalysis.alternatives.map((alt, index) => (
                                  <li key={index} className="text-sm">
                                    {alt.name} - ${alt.cost.toFixed(2)} (Effectiveness: {alt.effectiveness})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Start a chat to get personalized medication analysis.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Based on your prescription history, our AI provides:
                  </p>
                  <ul className="mt-2 list-disc pl-4 text-sm">
                    <li>Personalized health recommendations</li>
                    <li>Lifestyle suggestions</li>
                    <li>Preventive care tips</li>
                    <li>Medication adherence insights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 