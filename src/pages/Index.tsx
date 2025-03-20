
import { useState, useEffect, useRef } from 'react';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import ThinkingProcess from '@/components/ThinkingProcess';
import DocumentViewer from '@/components/DocumentViewer';
import AnalysisResult from '@/components/AnalysisResult';
import AnalysisProgress from '@/components/AnalysisProgress';
import WelcomeAnimation from '@/components/WelcomeAnimation';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { Message } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2Icon, RefreshCwIcon, MaximizeIcon, MinimizeIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendMessageToAIAgent } from '@/services/aiAgentService';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { state, uploadFile, resetAnalysis } = useDocumentAnalysis();
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showOnlyChatPanel, setShowOnlyChatPanel] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>('');
  
  useEffect(() => {
    const hours = new Date().getHours();
    let newGreeting = '';
    
    if (hours >= 5 && hours < 12) {
      newGreeting = 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      newGreeting = 'Good afternoon';
    } else {
      newGreeting = 'Good evening';
    }
    
    setGreeting(newGreeting);
  }, []);
  
  const handleSendMessage = async (content: string) => {
    const userMessageId = crypto.randomUUID();
    const newMessage: Message = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsWaitingForAI(true);
    
    if (showOnlyChatPanel) {
      setShowOnlyChatPanel(false);
    }
    
    try {
      const response = await sendMessageToAIAgent(content, conversationIdRef.current);
      
      conversationIdRef.current = response.conversationId;
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: "Failed to connect to the AI agent system."
      });
    } finally {
      setIsWaitingForAI(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (showOnlyChatPanel) {
      setShowOnlyChatPanel(false);
    }
    
    uploadFile(file).catch(() => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "An error occurred while analyzing the document."
      });
    });

    const uploadMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Uploading document: ${file.name}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, uploadMessage]);
  };

  const handleFileUpload = (file: File) => {
    console.log("File upload triggered with:", file.name);
    handleFileSelect(file);
  };

  const handleFollowUpQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewConversation = () => {
    setMessages([]);
    resetAnalysis();
    conversationIdRef.current = undefined;
    setShowOnlyChatPanel(true);
    toast({
      title: "Conversation Reset",
      description: "Started a new conversation"
    });
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const toggleLeftPanel = () => {
    setLeftPanelCollapsed(!leftPanelCollapsed);
    setRightPanelExpanded(leftPanelCollapsed ? false : true);
  };

  const toggleRightPanel = () => {
    setRightPanelExpanded(!rightPanelExpanded);
    setLeftPanelCollapsed(rightPanelExpanded ? false : true);
  };

  useEffect(() => {
    if (state.status === 'complete') {
      toast({
        title: "Analysis Complete",
        description: "Document analysis has been completed successfully!"
      });
      
      const completionMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I've completed analyzing your document. You can see the results in the left panel. Feel free to ask me any questions about it.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, completionMessage]);
    }
  }, [state.status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 overflow-hidden">
      {/* Header greeting with animation */}
      <div className="w-full max-w-5xl mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-subtle">
            <SunIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl font-medium text-foreground">
            {greeting}, friend
          </h1>
        </div>
      </div>
      
      {showOnlyChatPanel ? (
        <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg border border-border/50 animate-scale-in overflow-hidden">
          <div className="h-[70vh] flex flex-col">
            <div className="p-4 border-b bg-background/80 backdrop-blur-md flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold">AI Lawyer</h1>
                <p className="text-sm text-muted-foreground">Chat with AI about your legal documents</p>
              </div>
            </div>
            
            <ScrollArea className="flex-1 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <MessageList messages={messages} isWaiting={isWaitingForAI} />
                </div>
              </div>
            </ScrollArea>
            
            <ChatInput 
              onSendMessage={handleSendMessage} 
              onFileUpload={handleFileSelect}
              onNewConversation={handleNewConversation}
              isDisabled={isWaitingForAI || state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing'} 
            />
          </div>
        </Card>
      ) : (
        <div className="w-full max-w-7xl animate-scale-in">
          <ResizablePanelGroup direction="horizontal" className="rounded-xl overflow-hidden border border-border/50 shadow-lg">
            <ResizablePanel 
              defaultSize={40} 
              minSize={20}
              maxSize={80} 
              className={cn(
                "transition-all duration-300",
                leftPanelCollapsed && "!w-[80px] min-w-[80px] !max-w-[80px]"
              )}
              collapsible={leftPanelCollapsed}
              collapsedSize={5}
            >
              <div className="h-[70vh] flex flex-col">
                <div className="p-4 border-b flex items-center justify-between bg-background/80 backdrop-blur-md">
                  <div className={leftPanelCollapsed ? "hidden" : "block"}>
                    <h2 className="text-lg font-medium">
                      {state.status === 'idle' && 'Preview'}
                      {state.status === 'uploading' && 'Uploading Document...'}
                      {state.status === 'thinking' && 'Processing Document...'}
                      {state.status === 'analyzing' && 'Analyzing Document...'}
                      {state.status === 'complete' && 'Analysis Results'}
                      {state.status === 'error' && 'Analysis Error'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {state.status === 'idle' && ''}
                      {state.status === 'uploading' && 'Please wait while we upload your document'}
                      {state.status === 'thinking' && 'AI is processing your document'}
                      {state.status === 'analyzing' && 'Extracting insights from your document'}
                      {state.status === 'complete' && 'Review the extracted information'}
                      {state.status === 'error' && 'Something went wrong during analysis'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {state.status === 'complete' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleComparison}
                          className={cn("flex items-center gap-1", leftPanelCollapsed && "hidden")}
                        >
                          {showComparison ? "Exit Comparison" : "Compare Documents"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetAnalysis}
                          className={cn("flex items-center gap-1", leftPanelCollapsed && "hidden")}
                        >
                          <RefreshCwIcon size={14} />
                          <span>New Analysis</span>
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={toggleLeftPanel}
                      className="flex-shrink-0 ml-2"
                    >
                      {leftPanelCollapsed ? <MaximizeIcon size={18} /> : <MinimizeIcon size={18} />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {state.status === 'idle' && (
                    <ScrollArea className="h-full">
                      <div className="h-full flex items-center justify-center">
                        <WelcomeAnimation />
                      </div>
                    </ScrollArea>
                  )}
                  
                  {(state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing') && (
                    <ScrollArea className="h-full">
                      <div className="h-full flex flex-col">
                        <div className={cn(
                          "flex-1 flex flex-col items-center justify-center p-6 transition-opacity duration-500",
                          state.thinkingSteps.length > 0 ? "opacity-20" : "opacity-100"
                        )}>
                          <Loader2Icon size={40} className="text-primary animate-spin mb-4" />
                          <h3 className="text-lg font-medium mb-1">
                            {state.status === 'uploading' && 'Uploading Document...'}
                            {state.status === 'thinking' && 'Processing Document...'}
                            {state.status === 'analyzing' && 'Analyzing Content...'}
                          </h3>
                          <p className="text-sm text-muted-foreground text-center max-w-xs">
                            {state.status === 'uploading' && 'Preparing your document for analysis'}
                            {state.status === 'thinking' && 'The AI is examining your document structure'}
                            {state.status === 'analyzing' && 'Extracting key information and insights'}
                          </p>
                        </div>
                        
                        {state.thinkingSteps.length > 0 && (
                          <div className="absolute inset-x-0 bottom-0 p-6 glass rounded-t-2xl shadow-lg max-w-md mx-auto transition-all animate-slide-in-up">
                            <h3 className="text-sm font-medium mb-3">Analysis Progress</h3>
                            <ThinkingProcess steps={state.thinkingSteps} />
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                  
                  {state.status === 'complete' && state.file && state.result && (
                    <div className="h-full">
                      {showComparison ? (
                        <ResizablePanelGroup direction="horizontal" className="h-full">
                          <ResizablePanel defaultSize={50}>
                            <ScrollArea className="h-full">
                              <DocumentViewer 
                                fileName={state.file.name}
                                result={state.result}
                                comparison={true}
                              />
                            </ScrollArea>
                          </ResizablePanel>
                          <ResizableHandle withHandle />
                          <ResizablePanel defaultSize={50}>
                            <ScrollArea className="h-full">
                              <DocumentViewer 
                                fileName="Comparison Document"
                                result={state.result}
                                comparison={true}
                              />
                            </ScrollArea>
                          </ResizablePanel>
                        </ResizablePanelGroup>
                      ) : (
                        <div className="h-full grid grid-cols-2">
                          <div className="h-full border-r overflow-hidden">
                            <DocumentViewer 
                              fileName={state.file.name}
                              result={state.result}
                            />
                          </div>
                          <div className="h-full overflow-hidden">
                            <ScrollArea className="h-full">
                              <AnalysisResult result={state.result} />
                            </ScrollArea>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {state.status === 'error' && (
                    <ScrollArea className="h-full">
                      <div className="h-full flex flex-col items-center justify-center p-6">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                          <RefreshCwIcon size={24} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                          {state.error || "Something went wrong during the analysis. Please try again."}
                        </p>
                        <Button onClick={resetAnalysis}>Try Again</Button>
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </ResizablePanel>

            {!leftPanelCollapsed && !rightPanelExpanded && <ResizableHandle withHandle />}
            
            <ResizablePanel 
              defaultSize={60} 
              minSize={20}
              maxSize={80}
              className={cn(
                "transition-all duration-300",
                rightPanelExpanded && "!w-[calc(100%-80px)] !min-w-[calc(100%-80px)] !max-w-[calc(100%-80px)]"
              )}
            >
              <div className="h-[70vh] flex flex-col border-l">
                <div className="p-4 border-b bg-background/80 backdrop-blur-md flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-semibold">AI Lawyer</h1>
                    <p className="text-sm text-muted-foreground">Chat with AI about your legal documents</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleRightPanel}
                    className="flex-shrink-0"
                  >
                    {rightPanelExpanded ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 overflow-hidden">
                  <div className="flex flex-col h-full">
                    {state.thinkingSteps.length > 0 && (
                      <div className="px-4 py-3">
                        <AnalysisProgress 
                          status={state.status} 
                          progress={0} 
                          steps={state.thinkingSteps}
                          onFollowUpSelected={handleFollowUpQuestion}
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <MessageList messages={messages} isWaiting={isWaitingForAI} />
                    </div>
                    
                    {state.status === 'complete' && (
                      <div className="px-4 py-2 border-t flex items-center gap-2 bg-muted/20">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={resetAnalysis}
                          className="flex items-center gap-1"
                        >
                          <RefreshCwIcon size={14} />
                          <span>New Analysis</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  onFileUpload={handleFileSelect}
                  onNewConversation={handleNewConversation}
                  isDisabled={isWaitingForAI || state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing'} 
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
};

export default Index;
