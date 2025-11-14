import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Download, RefreshCw } from 'lucide-react';

interface PackingListItem {
  item: string;
  packed: boolean;
}

interface PackingListCategory {
  [key: string]: PackingListItem[];
}

interface TripPackingListProps {
  tripId: string;
}

export const TripPackingList: React.FC<TripPackingListProps> = ({ tripId }) => {
  const { token } = useAuth();
  const [packingList, setPackingList] = useState<PackingListCategory>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tips, setTips] = useState<string[]>([]);
  const client = createAIApiClient({ token: token || undefined });

  useEffect(() => {
    fetchPackingList();
  }, [tripId]);

  const fetchPackingList = async () => {
    setIsLoading(true);
    try {
      const response = await client.generatePackingList<any>(tripId);
      const categories = response.packingList?.categories || {};

      // Convert to itemized format with checkboxes
      const itemizedCategories: PackingListCategory = {};
      Object.entries(categories).forEach(([category, items]: [string, any]) => {
        if (Array.isArray(items)) {
          itemizedCategories[category] = items.map((item) => ({
            item,
            packed: false,
          }));
        }
      });

      setPackingList(itemizedCategories);
      setTips(response.packingList?.tips || []);
    } catch (error) {
      console.error('Error fetching packing list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePacked = (category: string, index: number) => {
    setPackingList((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) =>
        i === index ? { ...item, packed: !item.packed } : item
      ),
    }));
  };

  const packedCount = Object.values(packingList).flat().filter((item) => item.packed).length;
  const totalCount = Object.values(packingList).flat().length;

  const downloadPackingList = () => {
    const content = Object.entries(packingList)
      .map(
        ([category, items]) =>
          `${category.toUpperCase()}\n${items.map((i) => `${i.packed ? '✓' : '☐'} ${i.item}`).join('\n')}`
      )
      .join('\n\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'packing-list.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Packing Checklist</CardTitle>
            <CardDescription>
              {packedCount} of {totalCount} items packed
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPackingList}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPackingList}
              className="flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${totalCount > 0 ? (packedCount / totalCount) * 100 : 0}%` }}
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {Object.entries(packingList).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold capitalize text-sm mb-2 text-gray-700">{category}</h3>
              <div className="space-y-2 pl-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Checkbox
                      id={`${category}-${idx}`}
                      checked={item.packed}
                      onCheckedChange={() => togglePacked(category, idx)}
                    />
                    <label
                      htmlFor={`${category}-${idx}`}
                      className={`cursor-pointer text-sm ${
                        item.packed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {item.item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        {tips.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-semibold mb-2">💡 Packing Tips:</p>
            <ul className="space-y-2">
              {tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-blue-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripPackingList;
