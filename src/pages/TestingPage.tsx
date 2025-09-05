import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import BarcodeForm from '@/components/form/BarcodeForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FlaskConical, CheckCircle, XCircle, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function TestingPage() {
  const [currentBarcode, setCurrentBarcode] = useState('');
  const [testUnit, setTestUnit] = useState<any>(null);
  const [testResult, setTestResult] = useState<'pass' | 'fail' | ''>('');
  const [testNotes, setTestNotes] = useState('');
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const { toast } = useToast();

  const handleBarcodeSubmit = (barcode: string) => {
    // Validate barcode
    if (!barcode.startsWith('AU-')) {
      toast({
        title: "Invalid Barcode",
        description: "Please scan a valid Assembly Unit barcode",
        variant: "destructive"
      });
      setCurrentBarcode('');
      return;
    }

    // Simulate fetching test unit data
    setTestUnit({
      code: barcode,
      productName: 'Electronic Device Model X',
      assemblyDate: new Date().toLocaleDateString(),
      status: 'Ready for Testing'
    });
    
    setCurrentBarcode('');
    toast({
      title: "Unit Ready for Testing",
      description: `Loaded test unit: ${barcode}`,
    });
  };

  const handleSubmitTest = () => {
    if (!testResult) {
      toast({
        title: "Test Result Required",
        description: "Please select Pass or Fail",
        variant: "destructive"
      });
      return;
    }

    const testRecord = {
      unit: testUnit.code,
      result: testResult,
      notes: testNotes,
      timestamp: new Date(),
      tester: 'Operator'
    };

    setTestHistory([testRecord, ...testHistory]);
    
    toast({
      title: "Test Completed",
      description: `Unit ${testUnit.code} marked as ${testResult.toUpperCase()}`,
      variant: testResult === 'pass' ? 'default' : 'destructive'
    });

    // Reset form
    setTestUnit(null);
    setTestResult('');
    setTestNotes('');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Testing Station</h1>
          <p className="text-muted-foreground mt-1">
            Test assembled units for quality assurance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Unit Testing
              </CardTitle>
              <CardDescription>
                Scan unit and perform quality tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BarcodeForm
                label="Scan Unit for Testing"
                autoSubmit={false}
                onSubmit={handleBarcodeSubmit}
                valueCode={currentBarcode}
                onChangeCode={setCurrentBarcode}
                isEnable={!testUnit}
              />
              
              {testUnit && (
                <>
                  <div className="p-4 border rounded-lg bg-background">
                    <h3 className="font-semibold">{testUnit.productName}</h3>
                    <p className="text-sm text-muted-foreground">Code: {testUnit.code}</p>
                    <p className="text-sm text-muted-foreground">Assembly Date: {testUnit.assemblyDate}</p>
                    <Badge className="mt-2" variant="outline">{testUnit.status}</Badge>
                  </div>

                  <div className="space-y-3">
                    <Label>Test Result</Label>
                    <RadioGroup value={testResult} onValueChange={(value) => setTestResult(value as 'pass' | 'fail')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pass" id="pass" />
                        <Label htmlFor="pass" className="flex items-center gap-2 cursor-pointer">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Pass
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fail" id="fail" />
                        <Label htmlFor="fail" className="flex items-center gap-2 cursor-pointer">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Fail
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes">Test Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any observations or failure reasons..."
                      value={testNotes}
                      onChange={(e) => setTestNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitTest}
                    className="w-full"
                    size="lg"
                  >
                    Submit Test Result
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Test History
              </CardTitle>
              <CardDescription>
                Recent test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No tests completed yet
                  </p>
                ) : (
                  testHistory.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {test.result === 'pass' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{test.unit}</p>
                          <p className="text-sm text-muted-foreground">
                            {test.timestamp.toLocaleTimeString()}
                          </p>
                          {test.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {test.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={test.result === 'pass' ? 'default' : 'destructive'}>
                        {test.result.toUpperCase()}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}