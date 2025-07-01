
import React, { useState } from 'react';
import { Search, Plus, AlertTriangle, CheckCircle, XCircle, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Supplement {
  id: string;
  name: string;
  ingredients: { name: string; amount: string; unit: string }[];
}

interface NutrientStatus {
  name: string;
  current: number;
  rda: number;
  ul: number;
  status: 'adequate' | 'caution' | 'danger' | 'deficient';
  unit: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // 샘플 영양제 데이터
  const sampleSupplements: Supplement[] = [
    {
      id: '1',
      name: '종합비타민 멀티',
      ingredients: [
        { name: '비타민 C', amount: '1000', unit: 'mg' },
        { name: '비타민 D', amount: '400', unit: 'IU' },
        { name: '비타민 B12', amount: '50', unit: 'mcg' }
      ]
    },
    {
      id: '2',
      name: '비타민 C 1000',
      ingredients: [
        { name: '비타민 C', amount: '1000', unit: 'mg' }
      ]
    },
    {
      id: '3',
      name: '오메가-3',
      ingredients: [
        { name: 'EPA', amount: '300', unit: 'mg' },
        { name: 'DHA', amount: '200', unit: 'mg' }
      ]
    }
  ];

  // 영양소 상태 계산 (샘플)
  const calculateNutrientStatus = (): NutrientStatus[] => {
    const nutrients: NutrientStatus[] = [
      {
        name: '비타민 C',
        current: selectedSupplements.reduce((sum, sup) => {
          const vitC = sup.ingredients.find(ing => ing.name === '비타민 C');
          return sum + (vitC ? parseInt(vitC.amount) : 0);
        }, 0),
        rda: 100,
        ul: 2000,
        status: 'adequate',
        unit: 'mg'
      },
      {
        name: '비타민 D',
        current: selectedSupplements.reduce((sum, sup) => {
          const vitD = sup.ingredients.find(ing => ing.name === '비타민 D');
          return sum + (vitD ? parseInt(vitD.amount) : 0);
        }, 0),
        rda: 600,
        ul: 4000,
        status: 'adequate',
        unit: 'IU'
      }
    ];

    return nutrients.map(nutrient => {
      let status: NutrientStatus['status'] = 'adequate';
      if (nutrient.current === 0) status = 'deficient';
      else if (nutrient.current > nutrient.ul) status = 'danger';
      else if (nutrient.current > nutrient.rda * 1.5) status = 'caution';
      else if (nutrient.current < nutrient.rda * 0.8) status = 'deficient';
      
      return { ...nutrient, status };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger': return 'bg-red-100 text-red-800 border-red-300';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'adequate': return 'bg-green-100 text-green-800 border-green-300';
      case 'deficient': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <XCircle className="w-4 h-4" />;
      case 'caution': return <AlertTriangle className="w-4 h-4" />;
      case 'adequate': return <CheckCircle className="w-4 h-4" />;
      case 'deficient': return <Minus className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'danger': return '위험';
      case 'caution': return '주의';
      case 'adequate': return '적정';
      case 'deficient': return '부족';
      default: return '알 수 없음';
    }
  };

  const addSupplement = (supplement: Supplement) => {
    if (!selectedSupplements.find(s => s.id === supplement.id)) {
      setSelectedSupplements([...selectedSupplements, supplement]);
    }
  };

  const removeSupplement = (id: string) => {
    setSelectedSupplements(selectedSupplements.filter(s => s.id !== id));
  };

  const filteredSupplements = sampleSupplements.filter(supplement =>
    supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nutrientStatus = calculateNutrientStatus();

  const recommendedSupplements = [
    { name: '마그네슘', reason: '근육 기능과 신경 전달에 도움', ingredients: ['마그네슘 400mg'] },
    { name: '프로바이오틱스', reason: '장 건강 개선에 도움', ingredients: ['유산균 100억 CFU'] },
    { name: '코엔자임 Q10', reason: '심혈관 건강에 도움', ingredients: ['코엔자임 Q10 100mg'] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lovable</h1>
          <p className="text-lg text-gray-600">영양제 과복용 예방 서비스</p>
          <p className="text-sm text-gray-500 mt-1">건강한 영양제 복용을 위한 스마트한 선택</p>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analysis">복용 상태 분석</TabsTrigger>
            <TabsTrigger value="recommendations">영양제 추천</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            {/* 영양제 검색 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  복용 중인 영양제 추가
                </CardTitle>
                <CardDescription>
                  현재 복용 중인 영양제를 검색하여 추가해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="영양제 이름을 입력하세요 (예: 종합비타민)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                {searchTerm && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">검색 결과:</h4>
                    {filteredSupplements.map((supplement) => (
                      <div key={supplement.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div>
                          <h5 className="font-medium">{supplement.name}</h5>
                          <p className="text-sm text-gray-500">
                            {supplement.ingredients.map(ing => `${ing.name} ${ing.amount}${ing.unit}`).join(', ')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addSupplement(supplement)}
                          disabled={selectedSupplements.some(s => s.id === supplement.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          추가
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 선택된 영양제 */}
            {selectedSupplements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>현재 복용 중인 영양제</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedSupplements.map((supplement) => (
                      <div key={supplement.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div>
                          <h5 className="font-medium">{supplement.name}</h5>
                          <p className="text-sm text-gray-500">
                            {supplement.ingredients.map(ing => `${ing.name} ${ing.amount}${ing.unit}`).join(', ')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeSupplement(supplement.id)}
                        >
                          제거
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 영양소 상태 분석 */}
            {selectedSupplements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>영양소 복용 상태 분석</CardTitle>
                  <CardDescription>
                    RDA(권장섭취량) 및 UL(상한섭취량) 기준으로 분석된 결과입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {nutrientStatus.map((nutrient) => (
                      <div key={nutrient.name} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{nutrient.name}</h4>
                          <Badge className={`${getStatusColor(nutrient.status)} flex items-center gap-1`}>
                            {getStatusIcon(nutrient.status)}
                            {getStatusText(nutrient.status)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>현재 섭취량: {nutrient.current}{nutrient.unit}</div>
                          <div>권장섭취량: {nutrient.rda}{nutrient.unit}</div>
                          <div>상한섭취량: {nutrient.ul}{nutrient.unit}</div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              nutrient.status === 'danger' ? 'bg-red-500' :
                              nutrient.status === 'caution' ? 'bg-yellow-500' :
                              nutrient.status === 'adequate' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                            style={{
                              width: `${Math.min((nutrient.current / nutrient.ul) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>추천 영양제</CardTitle>
                <CardDescription>
                  건강한 생활을 위해 추천하는 영양제들입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedSupplements.map((supplement, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-lg mb-2">{supplement.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{supplement.reason}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">주요 성분:</p>
                        {supplement.ingredients.map((ingredient, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
