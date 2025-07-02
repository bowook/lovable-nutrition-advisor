
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Heart } from 'lucide-react';

interface PersonalInfo {
  age: string;
  gender: string;
  medications: string;
  healthConditions: string;
  isPregnant: string;
  lifestyle: string;
}

interface PersonalizedRecommendationProps {
  onRecommendationGenerated: (recommendations: any[]) => void;
}

const PersonalizedRecommendation = ({ onRecommendationGenerated }: PersonalizedRecommendationProps) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    age: '',
    gender: '',
    medications: '',
    healthConditions: '',
    isPregnant: '',
    lifestyle: ''
  });

  const generatePersonalizedRecommendations = () => {
    // 사용자 정보에 따른 맞춤 영양제 추천 로직
    const recommendations = [];

    // 나이별 추천
    const age = parseInt(personalInfo.age);
    if (age >= 50) {
      recommendations.push({
        name: '칼슘',
        reason: '50세 이상 골밀도 유지에 필요',
        products: ['솔가 칼슘 마그네슘 플러스 아연', '나우푸드 칼슘 & 마그네슘']
      });
      recommendations.push({
        name: '비타민 D',
        reason: '칼슘 흡수 도움 및 면역력 강화',
        products: ['나우푸드 비타민 D3 2000IU', '솔가 비타민 D3 1000IU']
      });
    }

    if (age >= 30) {
      recommendations.push({
        name: '오메가-3',
        reason: '심혈관 건강 및 뇌 기능 개선',
        products: ['노르딕 내추럴스 오메가-3', '캘리포니아 골드 오메가-3']
      });
    }

    // 성별별 추천
    if (personalInfo.gender === 'female') {
      recommendations.push({
        name: '철분',
        reason: '여성의 철분 부족 예방',
        products: ['솔가 철분 25mg', '나우푸드 철분 18mg']
      });
      
      if (personalInfo.isPregnant === 'yes') {
        recommendations.push({
          name: '엽산',
          reason: '임신 중 태아 발달에 필수',
          products: ['솔가 엽산 800mcg', '나우푸드 엽산 800mcg']
        });
      }
    }

    // 생활습관별 추천
    if (personalInfo.lifestyle.includes('스트레스') || personalInfo.lifestyle.includes('피로')) {
      recommendations.push({
        name: '마그네슘',
        reason: '스트레스 완화 및 근육 이완',
        products: ['나우푸드 마그네슘 글리시네이트', '닥터스 베스트 마그네슘']
      });
      recommendations.push({
        name: '비타민 B군',
        reason: '에너지 대사 및 신경 기능 개선',
        products: ['솔가 B-컴플렉스', '나우푸드 B-50']
      });
    }

    // 기본 추천 (모든 연령대)
    recommendations.push({
      name: '멀티비타민',
      reason: '기본적인 비타민 미네랄 보충',
      products: ['센트룸 멀티비타민', '나우푸드 종합비타민']
    });

    onRecommendationGenerated(recommendations);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          나만을 위한 영양제 추천
        </CardTitle>
        <CardDescription>
          개인 정보를 입력하시면 맞춤형 영양제를 추천해드립니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">나이</Label>
            <Input
              id="age"
              type="number"
              placeholder="예: 30"
              value={personalInfo.age}
              onChange={(e) => setPersonalInfo({...personalInfo, age: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="gender">성별</Label>
            <Select onValueChange={(value) => setPersonalInfo({...personalInfo, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="성별 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">남성</SelectItem>
                <SelectItem value="female">여성</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="medications">복용 중인 약물</Label>
          <Textarea
            id="medications"
            placeholder="현재 복용 중인 약물이 있다면 입력해주세요"
            value={personalInfo.medications}
            onChange={(e) => setPersonalInfo({...personalInfo, medications: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="healthConditions">건강 상태</Label>
          <Textarea
            id="healthConditions"
            placeholder="현재 앓고 있는 질병이나 건강상 문제가 있다면 입력해주세요"
            value={personalInfo.healthConditions}
            onChange={(e) => setPersonalInfo({...personalInfo, healthConditions: e.target.value})}
          />
        </div>

        {personalInfo.gender === 'female' && (
          <div>
            <Label htmlFor="pregnancy">임신 여부</Label>
            <Select onValueChange={(value) => setPersonalInfo({...personalInfo, isPregnant: value})}>
              <SelectTrigger>
                <SelectValue placeholder="임신 여부 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">아니오</SelectItem>
                <SelectItem value="yes">예</SelectItem>
                <SelectItem value="planning">임신 계획 중</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="lifestyle">생활습관 및 고민</Label>
          <Textarea
            id="lifestyle"
            placeholder="예: 스트레스가 많다, 피로를 자주 느낀다, 운동을 자주 한다 등"
            value={personalInfo.lifestyle}
            onChange={(e) => setPersonalInfo({...personalInfo, lifestyle: e.target.value})}
          />
        </div>

        <Button 
          onClick={generatePersonalizedRecommendations}
          className="w-full"
          disabled={!personalInfo.age || !personalInfo.gender}
        >
          <Heart className="w-4 h-4 mr-2" />
          맞춤 영양제 추천받기
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendation;
