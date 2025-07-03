import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const NutrientInfo = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const nutrients = [
    {
      name: '비타민 C',
      function: '항산화 작용, 면역력 강화, 콜라겐 합성',
      deficiencySymptoms: '괴혈병, 잇몸 출혈, 상처 치유 지연',
      richFoods: ['오렌지', '키위', '브로콜리', '딸기'],
      rda: '100mg',
      ul: '2000mg',
      category: '비타민'
    },
    {
      name: '비타민 D',
      function: '칼슘 흡수 촉진, 뼈 건강, 면역 조절',
      deficiencySymptoms: '골연화증, 근육 약화, 면역력 저하',
      richFoods: ['연어', '계란 노른자', '버섯', '우유'],
      rda: '600IU',
      ul: '4000IU',
      category: '비타민'
    },
    {
      name: '칼슘',
      function: '뼈와 치아 형성, 근육 수축, 신경 전달',
      deficiencySymptoms: '골다공증, 근육 경련, 치아 문제',
      richFoods: ['우유', '치즈', '멸치', '브로콜리'],
      rda: '1000mg',
      ul: '2500mg',
      category: '미네랄'
    },
    {
      name: '마그네슘',
      function: '근육 이완, 에너지 대사, 신경 안정',
      deficiencySymptoms: '근육 경련, 불안, 불면증, 피로',
      richFoods: ['견과류', '씨앗', '녹색 채소', '바나나'],
      rda: '400mg',
      ul: '350mg',
      category: '미네랄'
    },
    {
      name: '아연',
      function: '면역 기능, 상처 치유, 단백질 합성',
      deficiencySymptoms: '면역력 저하, 상처 치유 지연, 미각 손실',
      richFoods: ['굴', '소고기', '호박씨', '렌틸콩'],
      rda: '8mg',
      ul: '40mg',
      category: '미네랄'
    },
    {
      name: '오메가-3',
      function: '심혈관 건강, 뇌 기능, 염증 완화',
      deficiencySymptoms: '심혈관 질환 위험 증가, 인지 기능 저하',
      richFoods: ['연어', '고등어', '아마씨', '호두'],
      rda: '1-2g',
      ul: '3g',
      category: '지방산'
    },
    {
      name: '프로바이오틱스(유산균)',
      function: '장 건강, 소화 개선, 면역력 강화',
      deficiencySymptoms: '소화불량, 장 트러블, 면역력 저하',
      richFoods: ['요거트', '김치', '된장', '치즈'],
      rda: '10억~100억 CFU',
      ul: '-',
      category: '기타'
    },
    {
      name: '비타민 B1',
      function: '에너지 대사, 신경 기능 유지',
      deficiencySymptoms: '피로, 신경 손상, 각기병',
      richFoods: ['현미', '콩', '돼지고기', '견과류'],
      rda: '1.2mg',
      ul: '-',
      category: '비타민'
    },
    {
      name: '비타민 B2',
      function: '에너지 대사, 피부 및 점막 건강',
      deficiencySymptoms: '피부염, 구내염, 눈 충혈',
      richFoods: ['계란', '우유', '간', '아몬드'],
      rda: '1.4mg',
      ul: '-',
      category: '비타민'
    },
    {
      name: '비타민 B6',
      function: '단백질 대사, 신경 전달물질 합성',
      deficiencySymptoms: '피로, 신경과민, 피부염',
      richFoods: ['닭고기', '연어', '바나나', '감자'],
      rda: '1.5mg',
      ul: '100mg',
      category: '비타민'
    },
    {
      name: '비타민 B12',
      function: '적혈구 생성, 신경 기능 유지',
      deficiencySymptoms: '빈혈, 신경 손상, 피로',
      richFoods: ['간', '소고기', '계란', '유제품'],
      rda: '2.4mcg',
      ul: '-',
      category: '비타민'
    },
    {
      name: '철분',
      function: '적혈구 생성, 산소 운반',
      deficiencySymptoms: '빈혈, 피로, 창백함',
      richFoods: ['소고기', '간', '시금치', '조개류'],
      rda: '10-18mg',
      ul: '45mg',
      category: '미네랄'
    },
    {
      name: '엽산',
      function: '세포 분열, 태아 신경관 발달',
      deficiencySymptoms: '빈혈, 태아 신경관 결손',
      richFoods: ['시금치', '브로콜리', '콩', '아보카도'],
      rda: '400mcg',
      ul: '1000mcg',
      category: '비타민'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '비타민': return 'bg-blue-100 text-blue-800';
      case '미네랄': return 'bg-green-100 text-green-800';
      case '지방산': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryEmoji: Record<string, string> = {
    '비타민': '💊',
    '미네랄': '🧂',
    '지방산': '🥑',
    '기타': '🌱',
  };

  const foodEmoji: Record<string, string> = {
    '오렌지': '🍊', '키위': '🥝', '브로콜리': '🥦', '딸기': '🍓',
    '연어': '🐟', '계란 노른자': '🥚', '버섯': '🍄', '우유': '🥛',
    '치즈': '🧀', '멸치': '🐟', '견과류': '🥜', '씨앗': '🌰', '녹색 채소': '🥬', '바나나': '🍌',
    '굴': '🦪', '소고기': '🐄', '호박씨': '🎃', '렌틸콩': '🫘',
    '고등어': '🐟', '아마씨': '🌾', '호두': '🌰',
    '요거트': '🥣', '김치': '🥬', '된장': '🫘',
    '현미': '🌾', '콩': '🫘', '돼지고기': '🍖',
    '계란': '🥚', '간': '🫁', '아몬드': '🥜',
    '닭고기': '🍗', '감자': '🥔', '유제품': '🥛',
    '시금치': '🥬', '조개류': '🦪', '아보카도': '🥑',
  };

  const filteredNutrients = useMemo(() => {
    if (!search.trim()) return nutrients;
    const lower = search.toLowerCase();
    return nutrients.filter(nutrient =>
      nutrient.name.toLowerCase().includes(lower) ||
      nutrient.function.toLowerCase().includes(lower) ||
      nutrient.deficiencySymptoms.toLowerCase().includes(lower) ||
      nutrient.richFoods.some(food => food.toLowerCase().includes(lower))
    );
  }, [search, nutrients]);

  const groupedNutrients = filteredNutrients.reduce((acc, nutrient) => {
    if (!acc[nutrient.category]) acc[nutrient.category] = [];
    acc[nutrient.category].push(nutrient);
    return acc;
  }, {} as Record<string, typeof nutrients>);

  // 카테고리 순서 지정
  const categoryOrder = ['비타민', '미네랄', '지방산', '기타'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">영양소 정보</h1>
          <p className="text-gray-600 mb-4">각 영양소의 기능과 필요성을 자세히 알아보세요</p>
          <Input
            placeholder="영양소, 기능, 식품 등으로 검색하세요"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md mb-2"
          />
        </div>

        {/* 카테고리별로 그룹화하여 렌더링 */}
        {categoryOrder.map((category) => (
          groupedNutrients[category] && groupedNutrients[category].length > 0 ? (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>{categoryEmoji[category] || '🔸'}</span>
                {category}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupedNutrients[category].map((nutrient, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <span>{categoryEmoji[nutrient.category] || '🔸'}</span>
                          {nutrient.name}
                        </CardTitle>
                        <Badge className={getCategoryColor(nutrient.category)}>
                          {nutrient.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">주요 기능</h4>
                        <p className="text-sm text-gray-600">{nutrient.function}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">부족 시 증상</h4>
                        <p className="text-sm text-gray-600">{nutrient.deficiencySymptoms}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">풍부한 식품</h4>
                        <div className="flex flex-wrap gap-1">
                          {nutrient.richFoods.map((food, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                              <span>{foodEmoji[food] || '🍽️'}</span>
                              {food}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div>
                          <span className="text-xs text-gray-500">권장량</span>
                          <p className="text-sm font-medium">{nutrient.rda}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">상한량</span>
                          <p className="text-sm font-medium">{nutrient.ul}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default NutrientInfo;
