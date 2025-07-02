import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle, Minus, TrendingUp, Pill, ArrowLeft, Pin } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface NutrientStatus {
  name: string;
  current: number;
  rda: number;
  ul: number;
  status: 'adequate' | 'danger' | 'deficient';
  unit: string;
  percentage: number;
}

interface NutrientAnalysisChartProps {
  nutrientStatus: NutrientStatus[];
  onRecommendationRequest?: (deficientNutrients: string[], excessiveNutrients: string[]) => void;
}

// 고정 영양소 이름 배열(중복 정의 방지 위해 export)
export const fixedNutrientNames = [
  '비타민 C', '비타민 D', '오메가-3', '칼슘', '마그네슘', '프로바이오틱스'
];

const NutrientAnalysisChart = ({ nutrientStatus, onRecommendationRequest }: NutrientAnalysisChartProps) => {
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientStatus | null>(null);

  // 모든 영양소 섭취량이 0인지 확인
  const allZeroIntake = nutrientStatus.every(n => n.current === 0);
  if (allZeroIntake) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger': return '#ef4444';
      case 'adequate': return '#10b981';
      case 'deficient': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <XCircle className="w-4 h-4" />;
      case 'adequate': return <CheckCircle className="w-4 h-4" />;
      case 'deficient': return <AlertTriangle className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'danger': return '위험';
      case 'adequate': return '적정';
      case 'deficient': return '부족';
      default: return '알 수 없음';
    }
  };

  const deficientNutrients = nutrientStatus
    .filter(n => n.status === 'deficient')
    .map(n => n.name);
  
  const excessiveNutrients = nutrientStatus
    .filter(n => n.status === 'danger')
    .map(n => n.name);

  const handleGetRecommendations = () => {
    if (onRecommendationRequest) {
      onRecommendationRequest(deficientNutrients, excessiveNutrients);
    }
  };

  // 개별 영양소 막대 그래프 데이터 생성
  const generateIndividualChartData = (nutrient: NutrientStatus) => {
    return [
      { 
        name: '현재 섭취량', 
        value: nutrient.current, 
        fill: getStatusColor(nutrient.status)
      },
      { 
        name: '권장 섭취량', 
        value: nutrient.rda, 
        fill: '#10b981'
      },
      { 
        name: '상한 섭취량', 
        value: nutrient.ul, 
        fill: '#ef4444'
      }
    ];
  };

  if (selectedNutrient) {
    const chartData = generateIndividualChartData(selectedNutrient);
    
    return (
      <Card className="bg-white shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedNutrient(null)}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-gray-800">
              {selectedNutrient.name} 상세 분석
            </CardTitle>
          </div>
          <CardDescription>
            현재 섭취량과 권장량을 비교해보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 막대 그래프 */}
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: { label: "섭취량", color: getStatusColor(selectedNutrient.status) }
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      label={{ value: `${selectedNutrient.unit}`, angle: -90, position: 'insideLeft' }} 
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-semibold">{label}</p>
                              <p className="text-sm" style={{color: data.fill}}>
                                {data.value}{selectedNutrient.unit}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* 상세 정보 */}
            <div className="grid gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">현재 섭취량:</span>
                <span className="font-bold">{selectedNutrient.current}{selectedNutrient.unit}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-medium">권장 섭취량:</span>
                <span className="font-bold text-green-700">{selectedNutrient.rda}{selectedNutrient.unit}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="font-medium">상한 섭취량:</span>
                <span className="font-bold text-red-700">{selectedNutrient.ul}{selectedNutrient.unit}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-medium">현재 상태:</span>
                <div className="flex items-center gap-2">
                  <Badge style={{backgroundColor: getStatusColor(selectedNutrient.status)}} className="text-white">
                    {getStatusIcon(selectedNutrient.status)}
                    {getStatusText(selectedNutrient.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 영양소 목록 */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="w-5 h-5" />
            영양소 섭취 현황
          </CardTitle>
          <CardDescription>
            영양소를 클릭하여 상세 분석을 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {nutrientStatus.map((nutrient) => (
              <div 
                key={nutrient.name} 
                className="p-4 border rounded-lg bg-white hover:shadow-md transition-all cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedNutrient(nutrient)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-1">
                    {fixedNutrientNames.includes(nutrient.name) && (
                      <Pin className="w-4 h-4 text-blue-400" fill="#60a5fa" />
                    )}
                    {nutrient.name}
                  </h4>
                  <Badge 
                    className="flex items-center gap-1 text-white font-medium" 
                    style={{backgroundColor: getStatusColor(nutrient.status)}}
                  >
                    {getStatusIcon(nutrient.status)}
                    {getStatusText(nutrient.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>현재 섭취량:</span>
                    <span className="font-semibold">{nutrient.current}{nutrient.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>권장량:</span>
                    <span>{nutrient.rda}{nutrient.unit}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>상태:</span>
                    <span style={{color: getStatusColor(nutrient.status)}}>
                      {getStatusText(nutrient.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress 
                    value={Math.min(nutrient.percentage, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 개선 제안 */}
      {(deficientNutrients.length > 0 || excessiveNutrients.length > 0) && (
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Pill className="w-5 h-5" />
              개선 제안
            </CardTitle>
            <CardDescription>
              영양 상태를 개선하기 위한 제안입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {deficientNutrients.length > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  부족한 영양소
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {deficientNutrients.map(nutrient => (
                    <Badge key={nutrient} variant="secondary" className="bg-orange-100 text-orange-800">
                      {nutrient}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-orange-700">
                  이 영양소들이 부족합니다. 해당 영양소가 풍부한 영양제 복용을 고려해보세요.
                </p>
              </div>
            )}

            {excessiveNutrients.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  과다 섭취 영양소
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {excessiveNutrients.map(nutrient => (
                    <Badge key={nutrient} variant="secondary" className="bg-red-100 text-red-800">
                      {nutrient}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-red-700">
                  이 영양소들을 너무 많이 섭취하고 있습니다. 해당 영양소가 포함된 영양제의 복용량을 줄이거나 잠시 중단하는 것을 고려해보세요.
                </p>
              </div>
            )}

            <Button
              onClick={handleGetRecommendations}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Pill className="w-4 h-4 mr-2" />
              맞춤 영양제 추천받기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutrientAnalysisChart;
