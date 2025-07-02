
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Edit } from 'lucide-react';

interface SupplementIntake {
  id: string;
  name: string;
  ingredients: { name: string; amount: number; unit: string; dailyAmount: number }[];
  pillsPerDay: number;
  timesPerDay: number;
}

interface SupplementIntakeFormProps {
  supplements: any[];
  onIntakeUpdate: (intakes: SupplementIntake[]) => void;
}

const SupplementIntakeForm = ({ supplements, onIntakeUpdate }: SupplementIntakeFormProps) => {
  const [intakes, setIntakes] = useState<SupplementIntake[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addSupplement = (supplement: any) => {
    const newIntake: SupplementIntake = {
      id: supplement.id,
      name: supplement.name,
      ingredients: supplement.ingredients.map((ing: any) => ({
        name: ing.name,
        amount: parseInt(ing.amount),
        unit: ing.unit,
        dailyAmount: parseInt(ing.amount) // 기본값: 1일 1회 복용
      })),
      pillsPerDay: 1,
      timesPerDay: 1
    };
    
    const updatedIntakes = [...intakes, newIntake];
    setIntakes(updatedIntakes);
    onIntakeUpdate(updatedIntakes);
  };

  const updateIntake = (id: string, pillsPerDay: number, timesPerDay: number, newIngredients?: any[]) => {
    const updatedIntakes = intakes.map(intake => {
      if (intake.id === id) {
        const ingredientsToUse = newIngredients || intake.ingredients;
        const updatedIngredients = ingredientsToUse.map((ing: any) => ({
          ...ing,
          dailyAmount: ing.amount * pillsPerDay * timesPerDay
        }));
        return {
          ...intake,
          pillsPerDay,
          timesPerDay,
          ingredients: updatedIngredients
        };
      }
      return intake;
    });
    
    setIntakes(updatedIntakes);
    onIntakeUpdate(updatedIntakes);
    setEditingId(null);
  };

  const removeIntake = (id: string) => {
    const updatedIntakes = intakes.filter(intake => intake.id !== id);
    setIntakes(updatedIntakes);
    onIntakeUpdate(updatedIntakes);
  };

  const availableSupplements = supplements.filter(
    supp => !intakes.some(intake => intake.id === supp.id)
  );

  return (
    <div className="space-y-4">
      {/* 영양제 추가 */}
      {availableSupplements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>복용 중인 영양제 추가</CardTitle>
            <CardDescription>정확한 복용량을 입력하여 분석 정확도를 높여보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {availableSupplements.map(supplement => (
                <div key={supplement.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h5 className="font-medium">{supplement.name}</h5>
                    <p className="text-sm text-gray-500">
                      {supplement.ingredients.map((ing: any) => `${ing.name} ${ing.amount}${ing.unit}`).join(', ')}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => addSupplement(supplement)}>
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 복용량 입력 */}
      {intakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>복용량 설정</CardTitle>
            <CardDescription>정확한 복용량과 함량을 입력해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intakes.map(intake => (
                <div key={intake.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">{intake.name}</h5>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingId(editingId === intake.id ? null : intake.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeIntake(intake.id)}
                      >
                        <Minus className="w-4 h-4 mr-1" />
                        제거
                      </Button>
                    </div>
                  </div>

                  {editingId === intake.id ? (
                    <EditIntakeForm
                      intake={intake}
                      onSave={(pillsPerDay, timesPerDay, ingredients) => updateIntake(intake.id, pillsPerDay, timesPerDay, ingredients)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <Badge variant="secondary">
                          1회 {intake.pillsPerDay}알 × 하루 {intake.timesPerDay}회
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <strong>실제 1일 섭취량:</strong>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {intake.ingredients.map((ing, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ing.name} {ing.dailyAmount}{ing.unit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const EditIntakeForm = ({ intake, onSave, onCancel }: {
  intake: SupplementIntake;
  onSave: (pillsPerDay: number, timesPerDay: number, ingredients: any[]) => void;
  onCancel: () => void;
}) => {
  const [pillsPerDay, setPillsPerDay] = useState(intake.pillsPerDay);
  const [timesPerDay, setTimesPerDay] = useState(intake.timesPerDay);
  const [ingredients, setIngredients] = useState(intake.ingredients.map(ing => ({
    ...ing,
    amount: ing.amount // 현재 함량 값
  })));

  const updateIngredientAmount = (index: number, newAmount: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      amount: newAmount
    };
    setIngredients(updatedIngredients);
  };

  return (
    <div className="space-y-4 p-3 bg-gray-50 rounded">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pills">1회 복용량 (알)</Label>
          <Input
            id="pills"
            type="number"
            min="1"
            value={pillsPerDay}
            onChange={(e) => setPillsPerDay(parseInt(e.target.value) || 1)}
          />
        </div>
        <div>
          <Label htmlFor="times">1일 복용 횟수</Label>
          <Input
            id="times"
            type="number"
            min="1"
            max="10"
            value={timesPerDay}
            onChange={(e) => setTimesPerDay(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">성분별 함량 수정</Label>
        <div className="space-y-2">
          {ingredients.map((ing, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-center">
              <span className="text-sm">{ing.name}</span>
              <Input
                type="number"
                min="0"
                value={ing.amount}
                onChange={(e) => updateIngredientAmount(index, parseInt(e.target.value) || 0)}
                className="text-sm"
              />
              <span className="text-sm text-gray-500">{ing.unit}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <strong>예상 1일 섭취량:</strong>
        <div className="mt-1 flex flex-wrap gap-1">
          {ingredients.map((ing, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {ing.name} {ing.amount * pillsPerDay * timesPerDay}{ing.unit}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(pillsPerDay, timesPerDay, ingredients)}>
          저장
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
};

export default SupplementIntakeForm;
