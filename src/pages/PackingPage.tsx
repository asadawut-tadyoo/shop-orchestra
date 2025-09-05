import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import BarcodeForm from '@/components/form/BarcodeForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Package, CheckCircle, Truck, Box } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PackingPage() {
  const [currentBarcode, setCurrentBarcode] = useState('');
  const [packingUnit, setPackingUnit] = useState<any>(null);
  const [boxNumber, setBoxNumber] = useState('');
  const [packedItems, setPackedItems] = useState<any[]>([]);
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

    // Simulate fetching packing unit data
    setPackingUnit({
      code: barcode,
      productName: 'Electronic Device Model X',
      testResult: 'Passed',
      weight: '1.2 kg',
      dimensions: '30x20x10 cm',
      status: 'Ready for Packing'
    });
    
    setCurrentBarcode('');
    toast({
      title: "Unit Ready for Packing",
      description: `Loaded unit: ${barcode}`,
    });
  };

  const handlePackUnit = () => {
    if (!boxNumber) {
      toast({
        title: "Box Number Required",
        description: "Please enter a box number",
        variant: "destructive"
      });
      return;
    }

    const packedItem = {
      unit: packingUnit.code,
      productName: packingUnit.productName,
      boxNumber: boxNumber,
      timestamp: new Date(),
      operator: 'Operator'
    };

    setPackedItems([packedItem, ...packedItems]);
    
    toast({
      title: "Unit Packed Successfully",
      description: `${packingUnit.code} packed in box ${boxNumber}`,
    });

    // Reset form
    setPackingUnit(null);
    setBoxNumber('');
  };

  const getTotalPackedToday = () => {
    const today = new Date().toDateString();
    return packedItems.filter(item => 
      item.timestamp.toDateString() === today
    ).length;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Packing Station</h1>
          <p className="text-muted-foreground mt-1">
            Pack tested units for shipping
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Packing Process
              </CardTitle>
              <CardDescription>
                Scan unit and assign to shipping box
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BarcodeForm
                label="Scan Unit for Packing"
                autoSubmit={true}
                onSubmit={handleBarcodeSubmit}
                valueCode={currentBarcode}
                onChangeCode={setCurrentBarcode}
                isEnable={!packingUnit}
              />
              
              {packingUnit && (
                <>
                  <div className="p-4 border rounded-lg bg-background">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{packingUnit.productName}</h3>
                        <p className="text-sm text-muted-foreground">Code: {packingUnit.code}</p>
                        <p className="text-sm text-muted-foreground">Weight: {packingUnit.weight}</p>
                        <p className="text-sm text-muted-foreground">Dimensions: {packingUnit.dimensions}</p>
                      </div>
                      <Badge variant="default">
                        {packingUnit.testResult}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="box">Box Number</Label>
                    <Input
                      id="box"
                      type="text"
                      placeholder="Enter or scan box number..."
                      value={boxNumber}
                      onChange={(e) => setBoxNumber(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handlePackUnit}
                      className="flex-1"
                      size="lg"
                    >
                      <Box className="mr-2 h-4 w-4" />
                      Pack Unit
                    </Button>
                    <Button
                      onClick={() => {
                        setPackingUnit(null);
                        setBoxNumber('');
                      }}
                      variant="outline"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Packing Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Packed Today</span>
                    <span className="text-2xl font-bold">{getTotalPackedToday()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Total Packed</span>
                    <span className="text-2xl font-bold">{packedItems.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Packing</CardTitle>
                <CardDescription>
                  Last packed units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {packedItems.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 border rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.unit}</p>
                        <p className="text-xs text-muted-foreground">
                          Box: {item.boxNumber}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {packedItems.length === 0 && (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      No units packed yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}