
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle, Minus, TrendingUp } from 'lucide-react';

interface NutrientStatus {
  name: string;
  current: number;
  rda: number;
  ul: number;
  status: 'adequate' | 'caution' | 'danger' | 'deficient';
  unit: string;
  percentage: number;
}

interface NutrientAnalysisChartProps {
  nutrientStatus: NutrientStatus[];
  onRecommendationRequest?: (deficientNutrients: string[], excessiveNutrients: string[]) => void;
}

const NutrientAnalysisChart = ({ nutrientStatus, onRecommendationRequest }: NutrientAnalysisChartProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger': return '#ef4444';
      case 'caution': return '#f59e0b';
      case 'adequate': return '#10b981';
      case 'deficient': return '#6b7280';
      default: return '#6b7280';
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

  const chartData = nutrientStatus.map(nutrient => ({
    name: nutrient.name,
    current: nutrient.current,
    rda: nutrient.rda,
    ul: nutrient.ul,
    percentage: Math.round((nutrient.current / nutrient.rda) * 100),
    status: nutrient.status,
    color: getStatusColor(nutrient.status)
  }));

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

  return (
    <div className="space-y-6">
      {/* 차트 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            영양소 섭취 현황
          </CardTitle>
          <CardDescription>
            권장섭취량(RDA) 대비 현재 섭취량을 시각적으로 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              current: { label: "현재 섭취량", color: "hsl(var(--chart-1))" },
              rda: { label: "권장섭취량", color: "hsl(var(--chart-2))" }
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="percentage" name="권장량 대비 %">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 상세 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 영양소 분석</CardTitle>
          <CardDescription>
            각 영양소별 상세 정보와 상태를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {nutrientStatus.map((nutrient) => (
              <div key={nutrient.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{nutrient.name}</h4>
                  <Badge className={`flex items-center gap-1 text-white`} style={{backgroundColor: getStatusColor(nutrient.status)}}>
                    {getStatusIcon(nutrient.status)}
                    {getStatusText(nutrient.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>현재 섭취량:</span>
                    <span className="font-medium">{nutrient.current}{nutrient.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>권장섭취량:</span>
                    <span>{nutrient.rda}{nutrient.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>상한섭취량:</span>
                    <span>{nutrient.ul}{nutrient.unit}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>달성률:</span>
                    <span className={nutrient.percentage >= 100 ? "text-green-600" : "text-orange-600"}>
                      {nutrient.percentage}%
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress 
                    value={Math.min(nutrient.percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100% (권장량)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 개선 제안 */}
      {(deficientNutrients.length > 0 || excessiveNutrients.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>개선 제안</CardTitle>
            <CardDescription>
              영양 상태를 개선하기 위한 맞춤 제안입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deficientNutrients.length > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">부족한 영양소</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {deficientNutrients.map(nutrient => (
                    <Badge key={nutrient} variant="secondary">{nutrient}</Badge>
                  ))}
                </div>
                <p className="text-sm text-orange-700">
                  이 영양소들이 부족합니다. 해당 영양소가 풍부한 영양제 복용을 고려해보세요.
                </p>
              </div>
            )}

            {excessiveNutrients.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">과다 섭취 영양소</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {excessiveNutrients.map(nutrient => (
                    <Badge key={nutrient} variant="secondary">{nutrient}</Badge>
                  ))}
                </div>
                <p className="text-sm text-red-700">
                  이 영양소들을 너무 많이 섭취하고 있습니다. 해당 영양소가 포함된 영양제의 복용량을 줄이거나 잠시 중단하는 것을 고려해보세요.
                </p>
              </div>
            )}

            <button
              onClick={handleGetRecommendations}
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              맞춤 영양제 추천받기
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutrientAnalysisChart;
