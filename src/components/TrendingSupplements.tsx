
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

const TrendingSupplements = () => {
  const trendingSupplements = [
    {
      name: '마그네슘',
      reason: '스트레스 완화 및 수면 개선',
      popularity: '95%',
      keywords: ['스트레스', '수면', '근육이완']
    },
    {
      name: '비타민 D',
      reason: '면역력 강화 및 뼈 건강',
      popularity: '90%',
      keywords: ['면역력', '뼈건강', '우울감']
    },
    {
      name: '오메가-3',
      reason: '심혈관 건강 및 뇌 기능',
      popularity: '88%',
      keywords: ['심장건강', '뇌기능', '염증완화']
    },
    {
      name: '프로바이오틱스',
      reason: '장 건강 및 소화 개선',
      popularity: '85%',
      keywords: ['장건강', '소화', '면역력']
    },
    {
      name: '아연',
      reason: '면역력 강화 및 상처 치유',
      popularity: '82%',
      keywords: ['면역력', '상처치유', '항산화']
    },
    {
      name: '철분',
      reason: '빈혈 예방 및 에너지 증진',
      popularity: '78%',
      keywords: ['빈혈', '피로', '에너지']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          요즘 뜨는 영양제
        </CardTitle>
        <CardDescription>
          많은 사람들이 찾고 있는 인기 영양제를 확인해보세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trendingSupplements.map((supplement, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-lg">{supplement.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  인기도 {supplement.popularity}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{supplement.reason}</p>
              <div className="flex flex-wrap gap-1">
                {supplement.keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    #{keyword}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingSupplements;
