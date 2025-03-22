
import { AnalysisResult } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertTriangleIcon, 
  ArrowRightIcon, 
  CalendarIcon, 
  CheckIcon, 
  ClipboardCheckIcon, 
  DownloadIcon, 
  EditIcon, 
  ExternalLinkIcon, 
  FileTextIcon, 
  FlagIcon, 
  MailIcon, 
  SearchIcon, 
  UsersIcon,
  ChevronRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

type RiskLevel = 'Low' | 'Moderate' | 'High';

interface ResultsPanelProps {
  result: AnalysisResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  // Calculate risk level based on clauses
  const riskLevel: RiskLevel = result.clauses.length > 2 ? 'High' : result.clauses.length > 1 ? 'Moderate' : 'Low';
  
  // Count the number of high risk clauses (for demo purposes)
  const highRiskClauseCount = result.clauses.length > 2 ? 2 : result.clauses.length > 1 ? 1 : 0;
  
  // Get suggested revisions count (for demo purposes)
  const suggestedRevisions = result.clauses.length;

  // Helper function to get risk level styling
  const getRiskLevelStyle = (level: RiskLevel) => {
    switch(level) {
      case 'High':
        return 'text-red-500 bg-red-100 border-red-200';
      case 'Moderate':
        return 'text-amber-500 bg-amber-100 border-amber-200';
      case 'Low':
        return 'text-green-500 bg-green-100 border-green-200';
      default:
        return 'text-green-500 bg-green-100 border-green-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Main Analysis Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  <FileTextIcon size={20} className="mr-2 text-primary" />
                  Document Analysis
                </CardTitle>
                <Badge variant="outline" className={`${getRiskLevelStyle(riskLevel)}`}>
                  {riskLevel} Risk
                </Badge>
              </div>
              <CardDescription>
                {result.summary.substring(0, 100)}...
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-0">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <FileTextIcon size={18} className="mb-1 text-primary" />
                  <div className="text-xs text-muted-foreground">Documents</div>
                  <div className="font-semibold">1</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <AlertTriangleIcon size={18} className="mb-1 text-amber-500" />
                  <div className="text-xs text-muted-foreground">High Risk</div>
                  <div className="font-semibold">{highRiskClauseCount}</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <EditIcon size={18} className="mb-1 text-blue-500" />
                  <div className="text-xs text-muted-foreground">Revisions</div>
                  <div className="font-semibold">{suggestedRevisions}</div>
                </div>
              </div>
              
              {/* Analysis Sections (Accordion) */}
              <Accordion type="single" collapsible className="w-full">
                {/* Summarized Findings */}
                <AccordionItem value="findings" className="border rounded-md px-0 mb-2">
                  <AccordionTrigger className="py-2.5 px-3 text-sm font-medium hover:no-underline hover:bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <ClipboardCheckIcon size={16} className="mr-2 text-primary" />
                      Summarized Findings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <p className="text-sm">{result.summary}</p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Key Document Points:</h4>
                      <ul className="text-sm space-y-1.5">
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>This is a non-exclusive licensing agreement between two parties.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>Agreement is effective for 2 years with automatic renewal provisions.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>Standard confidentiality, non-compete, and termination clauses included.</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Key Data Extraction */}
                <AccordionItem value="data" className="border rounded-md px-0 mb-2">
                  <AccordionTrigger className="py-2.5 px-3 text-sm font-medium hover:no-underline hover:bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <SearchIcon size={16} className="mr-2 text-primary" />
                      Key Data Extraction
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-medium uppercase text-muted-foreground">Parties</h4>
                        <ul className="space-y-1.5">
                          {result.parties.map((party, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <Badge variant="outline" className="mr-2">{index === 0 ? 'First Party' : 'Second Party'}</Badge>
                              {party}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-medium uppercase text-muted-foreground">Key Dates</h4>
                        <ul className="space-y-1.5">
                          {result.keyDates.map((date, index) => (
                            <li key={index} className="text-sm flex items-center justify-between">
                              <span>{date.description}:</span>
                              <span className="font-medium">
                                {new Date(date.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Risk Identification */}
                <AccordionItem value="risks" className="border rounded-md px-0 mb-2">
                  <AccordionTrigger className="py-2.5 px-3 text-sm font-medium hover:no-underline hover:bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangleIcon size={16} className="mr-2 text-amber-500" />
                      Risk Identification
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {result.clauses.map((clause, index) => (
                        <Collapsible key={index} className="border rounded-md overflow-hidden">
                          <CollapsibleTrigger className="flex items-start justify-between w-full px-3 py-2 text-left hover:bg-muted/20">
                            <div className="flex items-start gap-2">
                              <FlagIcon 
                                size={14} 
                                className={`mt-0.5 ${index === 0 ? 'text-red-500' : index === 1 ? 'text-amber-500' : 'text-green-500'}`} 
                              />
                              <div>
                                <h4 className="text-sm font-medium">{clause.title}</h4>
                                <p className="text-xs text-muted-foreground">Page {clause.page}</p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${index === 0 ? 'text-red-500 bg-red-50' : index === 1 ? 'text-amber-500 bg-amber-50' : 'text-green-500 bg-green-50'}`}
                            >
                              {index === 0 ? 'High Risk' : index === 1 ? 'Moderate' : 'Low Risk'}
                            </Badge>
                            <ChevronRightIcon size={16} className="ml-2 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-3 py-2 border-t bg-muted/5">
                            <p className="text-sm">{clause.content}</p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">View in Document</Button>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Comparative Analysis */}
                <AccordionItem value="comparative" className="border rounded-md px-0 mb-2">
                  <AccordionTrigger className="py-2.5 px-3 text-sm font-medium hover:no-underline hover:bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <FileTextIcon size={16} className="mr-2 text-primary" />
                      Comparative Analysis
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <p className="text-sm mb-2">Comparison with standard templates shows the following deviations:</p>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-start gap-2 px-3 py-2 rounded-md bg-red-50">
                        <AlertTriangleIcon size={14} className="mt-1 text-red-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Termination Clause</div>
                          <p className="text-xs text-muted-foreground">Missing standard 30-day cure period for non-material breaches.</p>
                        </div>
                      </li>
                      <li className="text-sm flex items-start gap-2 px-3 py-2 rounded-md bg-amber-50">
                        <AlertTriangleIcon size={14} className="mt-1 text-amber-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium">Confidentiality</div>
                          <p className="text-xs text-muted-foreground">Extended period (5 years) exceeds company standard (3 years).</p>
                        </div>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Actionable Recommendations */}
                <AccordionItem value="recommendations" className="border rounded-md px-0 mb-2">
                  <AccordionTrigger className="py-2.5 px-3 text-sm font-medium hover:no-underline hover:bg-muted/20 rounded-md">
                    <div className="flex items-center">
                      <CheckIcon size={16} className="mr-2 text-primary" />
                      Actionable Recommendations
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <div className="space-y-2">
                      <div className="border rounded-md p-3 bg-muted/5">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-red-500">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">Add cure period to termination clause</h4>
                            <p className="text-xs text-muted-foreground mt-1">Add standard 30-day cure period for non-material breaches to align with company policy.</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">Dismiss</Button>
                          <Button variant="default" size="sm" className="h-7 text-xs">Accept</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3 bg-muted/5">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-amber-500">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">Adjust confidentiality period</h4>
                            <p className="text-xs text-muted-foreground mt-1">Reduce confidentiality period from 5 years to 3 years to align with company standard.</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 gap-2">
                          <Button variant="outline" size="sm" className="h-7 text-xs">Dismiss</Button>
                          <Button variant="default" size="sm" className="h-7 text-xs">Accept</Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4 pb-4 border-t mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <DownloadIcon size={14} />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <MailIcon size={14} />
                  Share
                </Button>
              </div>
              <Button variant="default" size="sm" className="gap-1">
                <EditIcon size={14} />
                Revision Suggestions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
