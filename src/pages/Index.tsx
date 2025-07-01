import React, { useState } from 'react';
import { Search, Plus, AlertTriangle, CheckCircle, XCircle, Minus, Pill } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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

interface RecommendedProduct {
  name: string;
  reason: string;
  ingredients: string[];
  products: {
    name: string;
    link: string;
  }[];
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([]);
  const [recommendationSearch, setRecommendationSearch] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);

  // 확장된 영양제 데이터
  const sampleSupplements: Supplement[] = [
    {
      id: '1',
      name: '종합비타민 멀티',
      ingredients: [
        { name: '비타민 C', amount: '1000', unit: 'mg' },
        { name: '비타민 D', amount: '400', unit: 'IU' },
        { name: '비타민 B12', amount: '50', unit: 'mcg' },
        { name: '아연', amount: '15', unit: 'mg' },
        { name: '칼슘', amount: '200', unit: 'mg' }
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
    },
    {
      id: '4',
      name: '아연 보충제',
      ingredients: [
        { name: '아연', amount: '20', unit: 'mg' }
      ]
    },
    {
      id: '5',
      name: '칼슘 + 마그네슘',
      ingredients: [
        { name: '칼슘', amount: '500', unit: 'mg' },
        { name: '마그네슘', amount: '250', unit: 'mg' }
      ]
    },
    {
      id: '6',
      name: '루테인 20mg',
      ingredients: [
        { name: '루테인', amount: '20', unit: 'mg' }
      ]
    },
    {
      id: '7',
      name: '마그네슘 400',
      ingredients: [
        { name: '마그네슘', amount: '400', unit: 'mg' }
      ]
    },
    {
      id: '8',
      name: '비타민 D3 1000IU',
      ingredients: [
        { name: '비타민 D', amount: '1000', unit: 'IU' }
      ]
    }
  ];

  // 확장된 영양소 상태 계산
  const calculateNutrientStatus = (): NutrientStatus[] => {
    const nutrients: NutrientStatus[] = [
      {
        name: '비타민 C',
        current: selectedSupplements.reduce((sum, sup) => {
          const nutrient = sup.ingredients.find(ing => ing.name === '비타민 C');
          return sum + (nutrient ? parseInt(nutrient.amount) : 0);
        }, 0),
        rda: 100,
        ul: 2000,
        status: 'adequate',
        unit: 'mg'
      },
      {
        name: '비타민 D',
        current: selectedSupplements.reduce((sum, sup) => {
          const nutrient = sup.ingredients.find(ing => ing.name === '비타민 D');
          return sum + (nutrient ? parseInt(nutrient.amount) : 0);
        }, 0),
        rda: 600,
        ul: 4000,
        status: 'adequate',
        unit: 'IU'
      },
      {
        name: '아연',
        current: selectedSupplements.reduce((sum, sup) => {
          const nutrient = sup.ingredients.find(ing => ing.name === '아연');
          return sum + (nutrient ? parseInt(nutrient.amount) : 0);
        }, 0),
        rda: 8,
        ul: 40,
        status: 'adequate',
        unit: 'mg'
      },
      {
        name: '칼슘',
        current: selectedSupplements.reduce((sum, sup) => {
          const nutrient = sup.ingredients.find(ing => ing.name === '칼슘');
          return sum + (nutrient ? parseInt(nutrient.amount) : 0);
        }, 0),
        rda: 1000,
        ul: 2500,
        status: 'adequate',
        unit: 'mg'
      },
      {
        name: '마그네슘',
        current: selectedSupplements.reduce((sum, sup) => {
          const nutrient = sup.ingredients.find(ing => ing.name === '마그네슘');
          return sum + (nutrient ? parseInt(nutrient.amount) : 0);
        }, 0),
        rda: 400,
        ul: 350,
        status: 'adequate',
        unit: 'mg'
      },
      {
        name: '루테인',
        current: selectedSupplements.reduce((sum, sup) => {
          const nutrient = sup.ingredients.find(ing => ing.name === '루테인');
          return sum + (nutrient ? parseInt(nutrient.amount) : 0);
        }, 0),
        rda: 10,
        ul: 20,
        status: 'adequate',
        unit: 'mg'
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

  const searchRecommendations = () => {
    if (!recommendationSearch.trim()) return;

    const nutrientRecommendations: { [key: string]: RecommendedProduct } = {
      '마그네슘': {
        name: '마그네슘',
        reason: '근육 기능과 신경 전달에 도움',
        ingredients: ['마그네슘 400mg'],
        products: [
          { name: 'Now Foods 마그네슘 글리시네이트 400mg', link: '' },
          { name: 'Doctor\'s Best 마그네슘 글리시네이트 200mg', link: '' }
        ]
      },
      '프로바이오틱스': {
        name: '프로바이오틱스',
        reason: '장 건강 개선에 도움',
        ingredients: ['유산균 100억 CFU'],
        products: [
          { name: 'Garden of Life RAW 프로바이오틱스 50억 CFU', link: '' },
          { name: 'Jarrow Formulas 젤도필러스 35억 CFU', link: '' }
        ]
      },
      '비타민 D': {
        name: '비타민 D',
        reason: '뼈 건강과 면역력 증진에 도움',
        ingredients: ['비타민 D3 2000IU'],
        products: [
          { name: 'Now Foods 비타민 D3 2000IU', link: '' },
          { name: 'Thorne 비타민 D/K2 1000IU', link: '' }
        ]
      },
      '오메가3': {
        name: '오메가-3',
        reason: '심혈관 건강과 뇌 기능에 도움',
        ingredients: ['EPA 300mg', 'DHA 200mg'],
        products: [
          { name: 'Nordic Naturals 오메가-3 690mg', link: '' },
          { name: 'California Gold Nutrition 오메가-3 1000mg', link: '' }
        ]
      },
      '아연': {
        name: '아연',
        reason: '면역 기능과 상처 치유에 도움',
        ingredients: ['아연 15mg'],
        products: [
          { name: 'Now Foods 아연 글루코네이트 50mg', link: '' },
          { name: 'Thorne 아연 비스글리시네이트 15mg', link: '' }
        ]
      },
      '칼슘': {
        name: '칼슘',
        reason: '뼈와 치아 건강에 도움',
        ingredients: ['칼슘 500mg'],
        products: [
          { name: 'Now Foods 칼슘 & 마그네슘 500mg/250mg', link: '' },
          { name: 'Solgar 칼슘 마그네슘 플러스 아연', link: '' }
        ]
      },
      '루테인': {
        name: '루테인',
        reason: '눈 건강과 황반 보호에 도움',
        ingredients: ['루테인 20mg'],
        products: [
          { name: 'Doctor\'s Best 루테인 20mg', link: '' },
          { name: 'Now Foods 루테인 10mg', link: '' }
        ]
      }
    };

    const searchTerm = recommendationSearch.toLowerCase();
    const matchedProducts: RecommendedProduct[] = [];

    Object.keys(nutrientRecommendations).forEach(key => {
      if (key.toLowerCase().includes(searchTerm) || 
          nutrientRecommendations[key].name.toLowerCase().includes(searchTerm)) {
        matchedProducts.push(nutrientRecommendations[key]);
      }
    });

    setRecommendedProducts(matchedProducts);
  };

  const filteredSupplements = sampleSupplements.filter(supplement =>
    supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nutrientStatus = calculateNutrientStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Pill className="w-8 h-8 text-blue-600" />
            💊 영양제 관리
          </h1>
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
                    placeholder="영양제 이름을 입력하세요 (예: 종합비타민, 아연, 칼슘, 마그네슘, 루테인)"
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
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  영양제 추천 검색
                </CardTitle>
                <CardDescription>
                  원하는 영양제나 성분을 입력하여 제품을 추천받으세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="영양제 이름을 입력하세요 (예: 마그네슘, 프로바이오틱스, 비타민D, 오메가3, 아연, 칼슘, 루테인)"
                    value={recommendationSearch}
                    onChange={(e) => setRecommendationSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={searchRecommendations}>
                    <Search className="w-4 h-4 mr-1" />
                    검색
                  </Button>
                </div>
              </CardContent>
            </Card>

            {recommendedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>추천 제품</CardTitle>
                  <CardDescription>
                    검색하신 영양제에 대한 추천 제품입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recommendedProducts.map((supplement, index) => (
                      <div key={index} className="space-y-4">
                        <div>
                          <h4 className="font-medium text-lg mb-2">{supplement.name}</h4>
                          <p className="text-sm text-gray-600 mb-4">{supplement.reason}</p>
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-2">주요 성분:</p>
                            <div className="flex flex-wrap gap-1">
                              {supplement.ingredients.map((ingredient, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-4">추천 제품:</p>
                          <Carousel className="w-full max-w-xl mx-auto">
                            <CarouselContent>
                              {supplement.products.map((product, idx) => (
                                <CarouselItem key={idx}>
                                  <div className="p-1">
                                    <Card>
                                      <CardContent className="flex flex-col items-center justify-center p-6">
                                        <div className="text-center">
                                          <h5 className="font-medium text-base mb-2">{product.name}</h5>
                                          <p className="text-sm text-gray-500">온라인 쇼핑몰에서 제품명으로 검색하세요</p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
