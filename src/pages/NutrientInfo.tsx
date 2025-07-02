
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const NutrientInfo = () => {
  const navigate = useNavigate();

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
          <p className="text-gray-600">각 영양소의 기능과 필요성을 자세히 알아보세요</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nutrients.map((nutrient, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{nutrient.name}</CardTitle>
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
                      <Badge key={idx} variant="outline" className="text-xs">
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
    </div>
  );
};

export default NutrientInfo;
