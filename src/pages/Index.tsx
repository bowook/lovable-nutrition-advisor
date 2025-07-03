import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, CheckCircle, XCircle, Minus, Pill, Info, ShoppingBag, Star, Award, TrendingUp, ArrowLeft, Heart, Edit, MinusCircle, TrendingDown, Pin, Clipboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';
import SupplementIntakeForm from '@/components/SupplementIntakeForm';
import NutrientAnalysisChart from '@/components/NutrientAnalysisChart';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Supplement {
  id: string;
  name: string;
  ingredients: { name: string; amount: string; unit: string }[];
}

interface NutrientStatus {
  name: string;
  current: number;
  rda: number;
  ul: number | null;
  status: 'adequate' | 'danger' | 'deficient';
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
  const { toast } = useToast();
  const [showNotice, setShowNotice] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  // 오늘 날짜 key
  const todayKey = `notice_closed_${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    if (!localStorage.getItem(todayKey)) {
      setShowNotice(true);
    }
  }, []);

  const handleCloseNotice = () => {
    setShowNotice(false);
    if (dontShowToday) {
      localStorage.setItem(todayKey, '1');
    }
  };

  // 복용 중인 영양제가 모두 제거되면 추천도 자동으로 비움
  useEffect(() => {
    if (supplementIntakes.length === 0) {
      setRecommendedProducts([]);
    }
  }, [supplementIntakes]);

  // 영양소 정보 보기와 동일한 영양소만 포함
  const sampleSupplements: Supplement[] = [
    {
      id: '1',
      name: '비타민 C',
      ingredients: [
        { name: '비타민 C', amount: '1000', unit: 'mg' }
      ]
    },
    {
      id: '2',
      name: '비타민 D',
      ingredients: [
        { name: '비타민 D', amount: '1000', unit: 'IU' }
      ]
    },
    {
      id: '3',
      name: '칼슘',
      ingredients: [
        { name: '칼슘', amount: '500', unit: 'mg' }
      ]
    },
    {
      id: '4',
      name: '마그네슘',
      ingredients: [
        { name: '마그네슘', amount: '250', unit: 'mg' }
      ]
    },
    {
      id: '5',
      name: '아연',
      ingredients: [
        { name: '아연', amount: '15', unit: 'mg' }
      ]
    },
    {
      id: '6',
      name: '오메가-3',
      ingredients: [
        { name: '오메가-3', amount: '1000', unit: 'mg' }
      ]
    },
    {
      id: '7',
      name: '프로바이오틱스(유산균)',
      ingredients: [
        { name: '프로바이오틱스', amount: '100', unit: '억 CFU' }
      ]
    },
    {
      id: '8',
      name: '비타민 B1',
      ingredients: [
        { name: '비타민 B1', amount: '1.2', unit: 'mg' }
      ]
    },
    {
      id: '9',
      name: '비타민 B2',
      ingredients: [
        { name: '비타민 B2', amount: '1.4', unit: 'mg' }
      ]
    },
    {
      id: '10',
      name: '비타민 B6',
      ingredients: [
        { name: '비타민 B6', amount: '1.5', unit: 'mg' }
      ]
    },
    {
      id: '11',
      name: '비타민 B12',
      ingredients: [
        { name: '비타민 B12', amount: '2.4', unit: 'mcg' }
      ]
    },
    {
      id: '12',
      name: '철분',
      ingredients: [
        { name: '철분', amount: '15', unit: 'mg' }
      ]
    },
    {
      id: '13',
      name: '엽산',
      ingredients: [
        { name: '엽산', amount: '400', unit: 'mcg' }
      ]
    }
  ];

  // 고정 영양소 이름 배열
  const fixedNutrientNames = [
    '비타민 C', '비타민 D', '오메가-3', '칼슘', '마그네슘', '프로바이오틱스'
  ];
  // 고정 영양소 목록
  const fixedNutrients = [
    { name: '비타민 C', rda: 100, ul: 2000, unit: 'mg' },
    { name: '비타민 D', rda: 600, ul: 4000, unit: 'IU' },
    { name: '오메가-3', rda: 1000, ul: 3000, unit: 'mg' },
    { name: '칼슘', rda: 1000, ul: 2500, unit: 'mg' },
    { name: '마그네슘', rda: 400, ul: 350, unit: 'mg' },
    { name: '프로바이오틱스', rda: 100, ul: null, unit: '억 CFU' }
  ];

  // 영양소 상태 계산 - 고정 6개 + 사용자 복용 영양소(고정 6개 제외)
  const calculateNutrientStatus = (): NutrientStatus[] => {
    // 복용 중인 영양제에서 모든 성분명 추출
    const allUserIngredients = Array.from(new Set(
      supplementIntakes.flatMap(intake => intake.ingredients.map((ing: any) => ing.name))
    ));
    // 고정 영양소 외의 사용자 복용 영양소만 추출
    const extraNutrients = allUserIngredients.filter(
      name => !fixedNutrientNames.includes(name)
    ).map(name => {
      // 권장량/상한량이 있는 영양소는 값 지정
      switch (name) {
        case '아연': return { name, rda: 8, ul: 40, unit: 'mg' };
        case '루테인': return { name, rda: 10, ul: 20, unit: 'mg' };
        case '철분': return { name, rda: 10, ul: 45, unit: 'mg' };
        case '엽산': return { name, rda: 400, ul: 1000, unit: 'mcg' };
        case '비타민 B1': return { name, rda: 1.2, ul: null, unit: 'mg' };
        case '비타민 B2': return { name, rda: 1.4, ul: null, unit: 'mg' };
        case '비타민 B6': return { name, rda: 1.5, ul: 100, unit: 'mg' };
        case '비타민 B12': return { name, rda: 2.4, ul: null, unit: 'mcg' };
        default: return { name, rda: 0, ul: null, unit: '' };
      }
    });
    // 최종 영양소 목록: 고정 6개 + 사용자 복용 영양소(중복 없이)
    const allNutrients = [...fixedNutrients, ...extraNutrients];

    return allNutrients.map(baseNutrient => {
      // 영양제에서 섭취량 계산
      let supplementIntake = 0;
      supplementIntakes.forEach(intake => {
        const ingredient = intake.ingredients.find((ing: any) => ing.name === baseNutrient.name);
        if (ingredient) {
          supplementIntake += ingredient.dailyAmount || 0;
        }
      });

      const current = supplementIntake;
      const percentage = baseNutrient.rda ? Math.round((current / baseNutrient.rda) * 100) : 0;
      let status: NutrientStatus['status'] = 'adequate';
      if (baseNutrient.rda && current < baseNutrient.rda) {
        status = 'deficient';
      } else if (baseNutrient.ul !== null && baseNutrient.ul !== undefined && current > baseNutrient.ul) {
        status = 'danger';
      } else {
        status = 'adequate';
      }
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

  // 추천 제품 링크 생성 함수 수정 (kr.iherb.com)
  function getProductLink(product) {
    if (product.link && product.link !== '#') return product.link;
    // kr.iherb.com 검색 링크로 연결
    return `https://kr.iherb.com/search?kw=${encodeURIComponent(product.name)}`;
  }

  // 복사 버튼 핸들러
  function handleCopyProductName(name) {
    navigator.clipboard.writeText(name).then(() => {
      toast({
        title: '복사 완료',
        description: `"${name}"이(가) 복사되었습니다.`,
        duration: 1500
      });
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공지 모달 */}
      <Dialog open={showNotice} onOpenChange={setShowNotice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              국내 폐지/문제 영양제 공지
            </DialogTitle>
            <DialogDescription>
              <div className="my-2 text-gray-800">
                <b>식약처/언론에 의해 국내에서 문제가 제기되어 폐지된 영양성분/영양제 안내</b>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li><b>에페드린</b> (Ephedrine): 심혈관계 부작용으로 국내 판매 금지</li>
                  <li><b>DMAA</b> (1,3-dimethylamylamine): 중추신경계 자극, 국내외 퇴출</li>
                  <li><b>시부트라민</b>: 체중감량제, 심혈관계 위험성으로 퇴출</li>
                  <li><b>카바카바</b>: 간 손상 위험성으로 국내외 금지</li>
                  <li><b>알로에 사포나린</b>: 발암 가능성 제기, 일부 제품 회수</li>
                </ul>
                <div className="mt-3 text-xs text-gray-500">※ 본 안내는 참고용 더미 데이터입니다.</div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  id="dontShowToday"
                  type="checkbox"
                  checked={dontShowToday}
                  onChange={e => setDontShowToday(e.target.checked)}
                  className="accent-red-500"
                />
                <label htmlFor="dontShowToday" className="text-sm">오늘 하루 보지 않기</label>
              </div>
              <Button
                variant="destructive"
                className="mt-4 w-full"
                onClick={handleCloseNotice}
              >
                닫기
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
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
                                        <div className="flex flex-col items-center">
                                          <h5 className="font-medium text-sm mb-1 flex items-center gap-1 group">
                                            {product.name}
                                            <button
                                              type="button"
                                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 rounded hover:bg-gray-100"
                                              onClick={e => { e.stopPropagation(); handleCopyProductName(product.name); }}
                                              title="제품명 복사"
                                            >
                                              <Clipboard className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                                            </button>
                                          </h5>
                                        </div>
                                        <p className="text-xs text-gray-500">온라인 약국에서 검색</p>
                                      </div>
                                      <a
                                        href={getProductLink(product)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                      >
                                        사이트 바로가기
                                      </a>
                                      <Badge variant="secondary" className="text-xs ml-2">
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
      {/* 푸터: PillSafety 로고 및 슬로건 */}
      <footer className="w-full py-6 flex flex-col items-center bg-transparent mt-12">
        <div className="text-lg font-bold text-blue-600 mb-1 flex items-center gap-2">
          <div className="p-2 bg-blue-500 rounded-full">
            <Pill className="w-6 h-6 text-white" />
          </div>
          PillSafety
        </div>
      </footer>
    </div>
  );
};

export default Index;
