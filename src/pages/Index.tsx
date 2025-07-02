import React, { useState } from 'react';
import { Search, Plus, AlertTriangle, CheckCircle, XCircle, Minus, Pill, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';
import PersonalizedRecommendation from '@/components/PersonalizedRecommendation';
import TrendingSupplements from '@/components/TrendingSupplements';
import SupplementIntakeForm from '@/components/SupplementIntakeForm';
import DietaryHabitsForm from '@/components/DietaryHabitsForm';
import NutrientAnalysisChart from '@/components/NutrientAnalysisChart';

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
  percentage: number;
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplements, setSelectedSupplements] = useState<Supplement[]>([]);
  const [supplementIntakes, setSupplementIntakes] = useState<any[]>([]);
  const [dietaryHabits, setDietaryHabits] = useState<any>(null);
  const [recommendationSearch, setRecommendationSearch] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<any[]>([]);

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

  // 식사 습관을 고려한 영양소 상태 계산
  const calculateNutrientStatus = (): NutrientStatus[] => {
    const baseNutrients = [
      { name: '비타민 C', rda: 100, ul: 2000, unit: 'mg' },
      { name: '비타민 D', rda: 600, ul: 4000, unit: 'IU' },
      { name: '아연', rda: 8, ul: 40, unit: 'mg' },
      { name: '칼슘', rda: 1000, ul: 2500, unit: 'mg' },
      { name: '마그네슘', rda: 400, ul: 350, unit: 'mg' },
      { name: '루테인', rda: 10, ul: 20, unit: 'mg' }
    ];

    return baseNutrients.map(baseNutrient => {
      // 영양제에서 섭취량 계산
      let supplementIntake = 0;
      supplementIntakes.forEach(intake => {
        const ingredient = intake.ingredients.find((ing: any) => ing.name === baseNutrient.name);
        if (ingredient) {
          supplementIntake += ingredient.dailyAmount || 0;
        }
      });

      // 식사에서 예상 섭취량 추가 (간단한 추정)
      let foodIntake = 0;
      if (dietaryHabits) {
        const allFoods = [
          ...dietaryHabits.vegetables,
          ...dietaryHabits.fruits,
          ...dietaryHabits.proteins,
          ...dietaryHabits.grains,
          ...dietaryHabits.dairy
        ];
        
        // 간단한 영양소 추정 로직
        allFoods.forEach(food => {
          const frequency = dietaryHabits.frequency[food] || '거의 안먹음';
          let multiplier = 0;
          
          switch (frequency) {
            case '거의 매일': multiplier = 0.8; break;
            case '주 3-4회': multiplier = 0.5; break;
            case '주 1-2회': multiplier = 0.2; break;
            default: multiplier = 0; break;
          }

          // 음식별 영양소 추정값 (매우 간단한 추정)
          if (baseNutrient.name === '비타민 C' && ['토마토', '브로콜리', '오렌지', '딸기', '키위'].includes(food)) {
            foodIntake += 20 * multiplier;
          } else if (baseNutrient.name === '칼슘' && ['우유', '치즈', '요거트'].includes(food)) {
            foodIntake += 100 * multiplier;
          } else if (baseNutrient.name === '아연' && ['견과류', '치즈', '계란'].includes(food)) {
            foodIntake += 2 * multiplier;
          }
        });
      }

      const current = supplementIntake + foodIntake;
      const percentage = Math.round((current / baseNutrient.rda) * 100);
      
      let status: NutrientStatus['status'] = 'adequate';
      if (current === 0) status = 'deficient';
      else if (current > baseNutrient.ul) status = 'danger';
      else if (current > baseNutrient.rda * 1.5) status = 'caution';
      else if (current < baseNutrient.rda * 0.8) status = 'deficient';
      
      return {
        ...baseNutrient,
        current,
        percentage,
        status
      };
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
    if (!recommendationSearch.trim()) {
      setRecommendedProducts([]);
      return;
    }

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

  const handleRecommendationRequest = (deficientNutrients: string[], excessiveNutrients: string[]) => {
    console.log('부족한 영양소:', deficientNutrients);
    console.log('과다한 영양소:', excessiveNutrients);
    // 여기에 맞춤 추천 로직 구현
  };

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
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/nutrient-info')}
            className="mt-4"
          >
            <Info className="w-4 h-4 mr-2" />
            영양소 정보 보기
          </Button>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analysis">스마트 분석</TabsTrigger>
            <TabsTrigger value="recommendations">영양제 추천</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            {/* 영양제 섭취량 입력 */}
            <SupplementIntakeForm 
              supplements={sampleSupplements}
              onIntakeUpdate={setSupplementIntakes}
            />

            {/* 식사 습관 입력 */}
            <DietaryHabitsForm onHabitsUpdate={setDietaryHabits} />

            {/* 영양소 분석 차트 */}
            {supplementIntakes.length > 0 && (
              <NutrientAnalysisChart 
                nutrientStatus={nutrientStatus}
                onRecommendationRequest={handleRecommendationRequest}
              />
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {/* 개인화된 추천 */}
            <PersonalizedRecommendation 
              onRecommendationGenerated={setPersonalizedRecommendations}
            />

            {/* 개인화된 추천 결과 */}
            {personalizedRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>나만을 위한 추천 결과</CardTitle>
                  <CardDescription>
                    입력하신 정보를 바탕으로 추천드리는 영양제입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {personalizedRecommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white">
                        <h4 className="font-medium text-lg mb-2">{rec.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">추천 제품:</p>
                          <div className="space-y-1">
                            {rec.products.map((product: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="mr-1 mb-1">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 요즘 뜨는 영양제 */}
            <TrendingSupplements />

            {/* 영양제 검색 */}
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

            {/* 검색 결과 */}
            {recommendationSearch && recommendedProducts.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">검색된 결과가 없습니다</p>
                    <p className="text-sm mt-1">다른 검색어를 시도해보세요</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 추천 제품 표시 */}
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
