import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import BarcodeForm from '@/components/form/BarcodeForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wrench, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AssemblyPage() {
  const [currentBarcode, setCurrentBarcode] = useState('');
  const [assemblyUnit, setAssemblyUnit] = useState<any>(null);
  const [assemblySteps, setAssemblySteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleBarcodeSubmit = (barcode: string) => {
    // Validate AU barcode format
    if (!barcode.startsWith('AU-')) {
      toast({
        title: "Invalid Barcode",
        description: "Assembly Unit barcode must start with 'AU-'",
        variant: "destructive"
      });
      setCurrentBarcode('');
      return;
    }

    // Simulate fetching assembly unit data
    setAssemblyUnit({
      code: barcode,
      productName: 'Electronic Device Model X',
      workOrder: 'WO-2024-001',
      status: 'In Assembly'
    });
    
    setAssemblySteps([
      'Component A Installation',
      'Component B Integration',
      'Wiring Connection',
      'Quality Check',
      'Final Assembly'
    ]);
    
    setCurrentBarcode('');
    toast({
      title: "Assembly Unit Loaded",
      description: `Started assembly for: ${barcode}`,
    });
  };

  const handleNextStep = () => {
    if (currentStep < assemblySteps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Completed",
        description: `Moving to: ${assemblySteps[currentStep + 1]}`,
      });
    } else {
      toast({
        title: "Assembly Complete",
        description: "Unit is ready for testing",
      });
      setAssemblyUnit(null);
      setAssemblySteps([]);
      setCurrentStep(0);
    }
  };

  const progress = assemblyUnit ? ((currentStep + 1) / assemblySteps.length) * 100 : 0;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Assembly Station</h1>
          <p className="text-muted-foreground mt-1">
            Scan assembly units and follow assembly instructions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Assembly Scanner
              </CardTitle>
              <CardDescription>
                Scan assembly unit barcode to begin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarcodeForm
                label="Scan Assembly Unit"
                autoSubmit={true}
                onSubmit={handleBarcodeSubmit}
                valueCode={currentBarcode}
                onChangeCode={setCurrentBarcode}
                isEnable={!assemblyUnit}
              />
              
              {assemblyUnit && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 border rounded-lg bg-background">
                    <h3 className="font-semibold">{assemblyUnit.productName}</h3>
                    <p className="text-sm text-muted-foreground">Code: {assemblyUnit.code}</p>
                    <p className="text-sm text-muted-foreground">Work Order: {assemblyUnit.workOrder}</p>
                    <Badge className="mt-2" variant="default">{assemblyUnit.status}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {assemblyUnit && (
            <Card>
              <CardHeader>
                <CardTitle>Assembly Progress</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {assemblySteps.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="w-full" />
                
                <div className="space-y-2">
                  {assemblySteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 border rounded-lg ${
                        index === currentStep 
                          ? 'bg-primary/10 border-primary' 
                          : index < currentStep 
                          ? 'bg-muted' 
                          : ''
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : index === currentStep ? (
                        <AlertCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2" />
                      )}
                      <span className={index <= currentStep ? 'font-medium' : 'text-muted-foreground'}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={handleNextStep}
                  className="w-full"
                  size="lg"
                >
                  {currentStep === assemblySteps.length - 1 ? 'Complete Assembly' : 'Next Step'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}