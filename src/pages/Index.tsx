
import React, { useState } from 'react';
import { Search, Plus, AlertTriangle, CheckCircle, XCircle, Minus, Pill, Info, ShoppingBag, Star, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';
import SupplementIntakeForm from '@/components/SupplementIntakeForm';
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
  const [supplementIntakes, setSupplementIntakes] = useState<any[]>([]);
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

  // 영양소 상태 계산
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

      const current = supplementIntake;
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

  // Enhanced recommendation system with specific product suggestions
  const getProductRecommendations = (deficientNutrients: string[]) => {
    const productDatabase: { [key: string]: RecommendedProduct } = {
      '비타민 C': {
        name: '비타민 C',
        reason: '면역력 강화와 항산화 작용에 도움',
        ingredients: ['비타민 C 1000mg'],
        products: [
          { name: 'Now Foods 비타민 C 1000mg', link: '#' },
          { name: 'Solgar 비타민 C 1000mg', link: '#' },
          { name: 'California Gold Nutrition 비타민 C', link: '#' }
        ]
      },
      '비타민 D': {
        name: '비타민 D',
        reason: '뼈 건강과 면역력 증진에 도움',
        ingredients: ['비타민 D3 2000IU'],
        products: [
          { name: 'Now Foods 비타민 D3 2000IU', link: '#' },
          { name: 'Thorne 비타민 D/K2', link: '#' },
          { name: 'Life Extension 비타민 D3', link: '#' }
        ]
      },
      '아연': {
        name: '아연',
        reason: '면역 기능과 상처 치유에 도움',
        ingredients: ['아연 15mg'],
        products: [
          { name: 'Now Foods 아연 글루코네이트 50mg', link: '#' },
          { name: 'Thorne 아연 비스글리시네이트 15mg', link: '#' },
          { name: 'Jarrow Formulas 아연 밸런스', link: '#' }
        ]
      },
      '칼슘': {
        name: '칼슘',
        reason: '뼈와 치아 건강에 도움',
        ingredients: ['칼슘 500mg'],
        products: [
          { name: 'Now Foods 칼슘 & 마그네슘', link: '#' },
          { name: 'Solgar 칼슘 마그네슘 플러스 아연', link: '#' },
          { name: 'Life Extension 칼슘 D-글루카레이트', link: '#' }
        ]
      },
      '마그네슘': {
        name: '마그네슘',
        reason: '근육 기능과 신경 전달에 도움',
        ingredients: ['마그네슘 400mg'],
        products: [
          { name: 'Now Foods 마그네슘 글리시네이트 400mg', link: '#' },
          { name: 'Doctor\'s Best 마그네슘 글리시네이트', link: '#' },
          { name: 'KAL 마그네슘 글리시네이트', link: '#' }
        ]
      },
      '루테인': {
        name: '루테인',
        reason: '눈 건강과 황반 보호에 도움',
        ingredients: ['루테인 20mg'],
        products: [
          { name: 'Doctor\'s Best 루테인 20mg', link: '#' },
          { name: 'Now Foods 루테인 10mg', link: '#' },
          { name: 'Jarrow Formulas 루테인', link: '#' }
        ]
      }
    };

    return deficientNutrients.map(nutrient => productDatabase[nutrient]).filter(Boolean);
  };

  const handleRecommendationRequest = (deficientNutrients: string[], excessiveNutrients: string[]) => {
    console.log('부족한 영양소:', deficientNutrients);
    console.log('과다한 영양소:', excessiveNutrients);
    
    // Get specific product recommendations for deficient nutrients
    const productRecommendations = getProductRecommendations(deficientNutrients);
    setRecommendedProducts(productRecommendations);
  };

  const nutrientStatus = calculateNutrientStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-full">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              PillSafety
            </h1>
          </div>
          <p className="text-gray-600">영양제 과복용 예방 서비스</p>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/nutrient-info')}
            className="mt-4"
          >
            <Info className="w-4 h-4 mr-2" />
            영양소 정보 보기
          </Button>
        </div>

        <div className="space-y-6">
          {/* 영양제 섭취량 입력 */}
          <SupplementIntakeForm 
            supplements={sampleSupplements}
            onIntakeUpdate={setSupplementIntakes}
          />

          {/* 영양소 분석 차트 */}
          {supplementIntakes.length > 0 && (
            <NutrientAnalysisChart 
              nutrientStatus={nutrientStatus}
              onRecommendationRequest={handleRecommendationRequest}
            />
          )}

          {/* 맞춤 추천 결과 표시 */}
          {recommendedProducts.length > 0 && (
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Pill className="w-5 h-5" />
                  부족한 영양소 맞춤 제품 추천
                </CardTitle>
                <CardDescription>
                  부족한 영양소를 보충할 수 있는 제품을 추천해드립니다
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {recommendedProducts.map((supplement, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-4">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800">{supplement.name}</h4>
                        <p className="text-gray-600 mb-3">{supplement.reason}</p>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">주요 성분:</p>
                          <div className="flex flex-wrap gap-2">
                            {supplement.ingredients.map((ingredient, idx) => (
                              <Badge key={idx} variant="secondary">
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">추천 제품:</p>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {supplement.products.map((product, idx) => (
                              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-2">
                                  <Card className="bg-white shadow-sm">
                                    <CardContent className="p-4 text-center">
                                      <div className="mb-3">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                          <Pill className="w-6 h-6 text-white" />
                                        </div>
                                        <h5 className="font-medium text-sm mb-1">{product.name}</h5>
                                        <p className="text-xs text-gray-500">온라인 약국에서 검색</p>
                                      </div>
                                      <Badge variant="secondary" className="text-xs">
                                        추천
                                      </Badge>
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
        </div>
      </div>
    </div>
  );
};

export default Index;
