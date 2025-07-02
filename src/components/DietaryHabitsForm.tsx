
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed } from 'lucide-react';

interface DietaryHabits {
  vegetables: string[];
  fruits: string[];
  proteins: string[];
  grains: string[];
  dairy: string[];
  frequency: { [key: string]: string };
}

interface DietaryHabitsFormProps {
  onHabitsUpdate: (habits: DietaryHabits) => void;
}

const DietaryHabitsForm = ({ onHabitsUpdate }: DietaryHabitsFormProps) => {
  const [habits, setHabits] = useState<DietaryHabits>({
    vegetables: [],
    fruits: [],
    proteins: [],
    grains: [],
    dairy: [],
    frequency: {}
  });

  const foodCategories = {
    vegetables: {
      title: '채소류',
      items: ['시금치', '브로콜리', '당근', '토마토', '양배추', '피망', '양파', '마늘']
    },
    fruits: {
      title: '과일류',
      items: ['바나나', '사과', '오렌지', '키위', '딸기', '블루베리', '포도', '아보카도']
    },
    proteins: {
      title: '단백질',
      items: ['닭가슴살', '계란', '연어', '참치', '두부', '콩', '견과류', '치즈']
    },
    grains: {
      title: '곡물류',
      items: ['현미', '귀리', '퀴노아', '통밀빵', '고구마', '감자', '옥수수', '보리']
    },
    dairy: {
      title: '유제품',
      items: ['우유', '요거트', '치즈', '버터', '아이스크림']
    }
  };

  const frequencyOptions = ['거의 안먹음', '주 1-2회', '주 3-4회', '거의 매일'];

  const handleFoodSelect = (category: keyof DietaryHabits, food: string) => {
    if (category === 'frequency') return;
    
    const currentFoods = habits[category] as string[];
    const updatedFoods = currentFoods.includes(food)
      ? currentFoods.filter(f => f !== food)
      : [...currentFoods, food];
    
    const updatedHabits = {
      ...habits,
      [category]: updatedFoods
    };
    
    setHabits(updatedHabits);
    onHabitsUpdate(updatedHabits);
  };

  const handleFrequencySelect = (food: string, frequency: string) => {
    const updatedHabits = {
      ...habits,
      frequency: {
        ...habits.frequency,
        [food]: frequency
      }
    };
    
    setHabits(updatedHabits);
    onHabitsUpdate(updatedHabits);
  };

  const getSelectedFoods = () => {
    return [
      ...habits.vegetables,
      ...habits.fruits,
      ...habits.proteins,
      ...habits.grains,
      ...habits.dairy
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5" />
          식사 습관 분석
        </CardTitle>
        <CardDescription>
          평소 자주 드시는 음식을 선택해주세요. 영양소 섭취량을 더 정확히 분석할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(foodCategories).map(([category, { title, items }]) => (
          <div key={category}>
            <h4 className="font-medium mb-3">{title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {items.map(food => (
                <div
                  key={food}
                  className={`p-2 border rounded cursor-pointer text-sm text-center transition-colors ${
                    (habits[category as keyof DietaryHabits] as string[]).includes(food)
                      ? 'bg-blue-100 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleFoodSelect(category as keyof DietaryHabits, food)}
                >
                  {food}
                </div>
              ))}
            </div>
          </div>
        ))}

        {getSelectedFoods().length > 0 && (
          <div>
            <h4 className="font-medium mb-3">선택한 음식의 섭취 빈도</h4>
            <div className="space-y-3">
              {getSelectedFoods().map(food => (
                <div key={food} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{food}</span>
                  <div className="flex gap-1">
                    {frequencyOptions.map(freq => (
                      <Button
                        key={freq}
                        size="sm"
                        variant={habits.frequency[food] === freq ? "default" : "outline"}
                        onClick={() => handleFrequencySelect(food, freq)}
                        className="text-xs"
                      >
                        {freq}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {getSelectedFoods().length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>선택된 음식:</strong> {getSelectedFoods().length}개
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {getSelectedFoods().map(food => (
                <Badge key={food} variant="secondary" className="text-xs">
                  {food}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DietaryHabitsForm;
