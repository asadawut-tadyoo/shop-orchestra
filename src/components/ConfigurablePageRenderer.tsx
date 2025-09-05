import { useState } from 'react';
import { PageConfig, pageConfigurations } from '@/config/pageConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Settings } from 'lucide-react';

/**
 * ConfigurablePageRenderer - Dynamically renders pages based on configuration
 * This component reads the pageConfigurations and renders each page component
 * with BarcodeForm integrated according to the config
 */
export default function ConfigurablePageRenderer() {
  const [activePageId, setActivePageId] = useState<string>(pageConfigurations[0]?.id || '');

  const renderPageContent = (config: PageConfig) => {
    const Component = config.component;
    
    // Pass the barcode configuration as props to each component
    // Each component internally uses BarcodeForm with these settings
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{config.name}</h2>
            {config.description && (
              <p className="text-muted-foreground mt-1">{config.description}</p>
            )}
          </div>
          {config.workflow?.nextPage && (
            <Badge variant="outline" className="flex items-center gap-1">
              Next: {config.workflow.nextPage}
              <ArrowRight className="h-3 w-3" />
            </Badge>
          )}
        </div>
        
        {/* Render the actual page component */}
        <Component barcodeConfig={config.barcodeFormConfig} />
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Configuration-Driven Pages</h1>
        </div>

        <Tabs value={activePageId} onValueChange={setActivePageId}>
          <TabsList className="grid grid-cols-5 w-full">
            {pageConfigurations.map((config) => (
              <TabsTrigger key={config.id} value={config.id}>
                {config.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {pageConfigurations.map((config) => (
            <TabsContent key={config.id} value={config.id} className="mt-6">
              {renderPageContent(config)}
            </TabsContent>
          ))}
        </Tabs>

        {/* Configuration Display Card */}
        <Card>
          <CardHeader>
            <CardTitle>Active Configuration</CardTitle>
            <CardDescription>
              Current page configuration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pageConfigurations
              .filter(config => config.id === activePageId)
              .map(config => (
                <div key={config.id} className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Page ID:</span> {config.id}
                    </div>
                    <div>
                      <span className="font-medium">Component:</span> {config.component.name}
                    </div>
                    <div>
                      <span className="font-medium">Barcode Label:</span> {config.barcodeFormConfig.label}
                    </div>
                    <div>
                      <span className="font-medium">Auto Submit:</span> {config.barcodeFormConfig.autoSubmit ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  {config.apiEndpoints && (
                    <div className="pt-3 border-t">
                      <p className="font-medium text-sm mb-2">API Endpoints:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {Object.entries(config.apiEndpoints).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {config.workflow && (
                    <div className="pt-3 border-t">
                      <p className="font-medium text-sm mb-2">Workflow:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {config.workflow.previousPage && (
                          <div>Previous: {config.workflow.previousPage}</div>
                        )}
                        {config.workflow.nextPage && (
                          <div>Next: {config.workflow.nextPage}</div>
                        )}
                        {config.workflow.requiresAuth && (
                          <div>Requires Authentication: Yes</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}