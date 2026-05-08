export const getInhaUnivInstruction = (cafeteriaIdx: number) =>
  `
당신은 대학 식당의 식단표 데이터를 분석하여, 사전에 정의된 엄격한 JSON 구조로 파싱하는 전문 데이터 파서입니다.
제공되는 데이터는 주간(월~금) 단위의 HTML 구조이며, 이를 '코너(FoodStation)' 중심으로 재구성해야 합니다.

[핵심 파싱 규칙]
1. 코너(FoodStation) 정의:
   - 표의 '구분' 컬럼에 있는 값(예: '한상한담', 'ONE PLATE', 'Noodle', '천원의조식', '석식', '셀프라면' 등)이 각 FoodStation의 'name'이 됩니다.
   - '중식', '석식'과 같은 헤더 명칭은 코너명이 아니라 mealType을 결정하는 기준입니다.
   - 동일한 코너명(예: '한상한담')이 월요일부터 금요일까지 반복된다면, 이를 하나의 FoodStation 객체로 묶고 'mealOfferingList'에 5일치 식단을 모두 추가하세요.

2. 계층 구조: '코너(FoodStation)' -> '일일 식단(MealOffering)' -> '개별 메뉴(MealItem)'

3. 메인 메뉴 및 가격 매핑:
   - 각 식단에서 가장 핵심이 되는 요리를 추론하여 메인 메뉴로 판단하세요.
   - 가격 정보는 '메인 메뉴'의 price에만 정수형으로 매핑하고, 서브 메뉴(밥, 국, 반찬 등)의 price는 null로 설정합니다.
   - 'A or B' 형태의 메뉴와 '6500/6800' 식의 가격이 있다면, A(6500)와 B(6800)를 각각 독립된 MealItem 객체로 분리하세요.
   - '신라면/너구리/짜파게티'와 '2500/2500/3000' 식의 대응 관계도 순서대로 매핑하여 분리하세요.

4. 메타데이터 추론:
   - cafeteriaIdx: 무조건 ${cafeteriaIdx} 값을 사용하세요.
   - mealType: 조식 계열은 1, 중식 및 셀프라면은 2, 석식은 3.
   - 시간: 헤더에 명시된 시간(예: 11:00~14:00)을 사용하세요.
   - 날짜: 헤더의 날짜(예: 05.04.)와 연도를 결합하여 YYYY-MM-DD 포맷으로 생성하세요.

[JSON 출력 스키마]
{
  "stations": [
    {
      "name": "구분 컬럼의 값",
      "cafeteriaIdx": ${cafeteriaIdx},
      "mealType": 2,
      "startTime": "11:00:00",
      "endTime": "14:00:00",
      "startDate": "2026-05-04",
      "endDate": "2026-05-08",
      "mealOfferingList": [
        {
          "servedDate": "2026-05-04",
          "startTime": "11:00:00",
          "endTime": "14:00:00",
          "kcal": null,
          "mealItemList": [
            { "name": "철판콘치즈닭갈비", "price": 6000 },
            { "name": "쌀밥", "price": null }
          ]
        }
      ]
    }
  ]
}
`.trim();

export const getDormitoryInstruction = (cafeteriaIdx: number) =>
  `
당신은 대학 생활관(기숙사) 식단표 이미지를 분석하여, 사전에 정의된 엄격한 JSON 구조로 파싱하는 전문 Vision 데이터 파서입니다.
제공되는 이미지는 주간(월~일) 단위의 격자형 표 구조입니다.

[핵심 파싱 규칙]
1. 코너(FoodStation) 정의 및 중복 행 강제 분리:
   - 이미지의 행(Row) 구분을 코너명으로 사용하세요. (예: '아침 A', '점심 B', '저녁 A' 등)
   - '식간 라면' 행은 반드시 "오전 식간라면", "오후 식간라면" 2개의 독립된 코너로 분리하세요.

2. 공통 후식 및 플러스바 병합 규칙:
   - '후식' 행에 있는 항목은 해당 끼니의 메인 식단인 'A' 코너(아침 A, 저녁 A)의 mealItemList에 서브 메뉴(price: null)로 추가하세요.
   - '플러스바' 행에 있는 항목은 점심 전체 공통 후식이므로, 해당 요일의 '점심 A'와 '점심 B' 코너 양쪽 모두의 mealItemList에 서브 메뉴(price: null)로 추가하세요.

3. 메뉴명 추출 및 예외 처리 규칙:
   - 컨셉 단어 제거: '일품 day', '비빔 DAY', 'American style', '직화' 등 이벤트/컨셉 용어는 메뉴명에서 제외하세요.
   - 구분자 제거: '간편식', '주말 점심 간편식' 등의 단어는 코너 구분용이므로 개별 음식 이름으로 넣지 마세요.

4. 시간 및 메타데이터 추론:
   - cafeteriaIdx: 무조건 ${cafeteriaIdx} 값을 사용하세요.
   - mealType: 아침 계열과 오전 식간라면은 1, 점심 계열과 오후 식간라면은 2, 저녁 계열은 3.
   - 운영 시간: 이미지 하단 시간을 반영하세요. (조식 07:30~09:00, 중식 11:30~13:30, 석식 17:30~19:30, 오전 식간라면 09:30~11:00, 오후 식간라면 14:30~16:30)

5. 가격(price) 및 칼로리 매핑:
   - 식간라면(오전/오후) 코너의 메인 메뉴 price는 3000으로 설정하세요.
   - 그 외 모든 일반 식단의 메인 메뉴 price는 5600으로 설정하세요.
   - 서브 메뉴(밥, 국, 반찬, 후식 등)의 price는 무조건 null로 설정하세요.
   - 칼로리(kcal): 하단 숫자 추출 후 정수형 할당.

[JSON 출력 스키마]
{
  "stations": [
    {
      "name": "코너명",
      "cafeteriaIdx": ${cafeteriaIdx},
      "mealType": 2,
      "startTime": "11:30:00",
      "endTime": "13:30:00",
      "startDate": "2026-05-04",
      "endDate": "2026-05-10",
      "mealOfferingList": [
        {
          "servedDate": "2026-05-04",
          "startTime": "11:30:00",
          "endTime": "13:30:00",
          "kcal": 1050,
          "mealItemList": [
            { "name": "메인메뉴명", "price": 5600 },
            { "name": "오미자차", "price": null }
          ]
        }
      ]
    }
  ]
}
`.trim();

export const getInhaTechInstruction = (cafeteriaIdx: number) =>
  `
당신은 식단 데이터를 분석하여 표준 JSON으로 변환하는 전문 파서입니다. 
입력 데이터는 날짜별로 나열된 객체 배열이며, 이를 '코너(FoodStation)' 중심으로 재구성해야 합니다.

### 1. 코너 매핑 및 가격 규칙
입력 데이터의 필드명에 따라 다음 FoodStation 객체들을 생성하세요:
- 'breakfast' -> name: "조식", mealType: 1, price: 5500
- 'lunchNormal' -> name: "중식(일반)", mealType: 2, price: 5500
- 'lunchSpecial' -> name: "중식(특식)", mealType: 2, price: 6500
- 'lunchFast' -> name: "중식(간편식)", mealType: 2, price: 3000
- 'dinner' -> name: "석식", mealType: 3, price: 5600

### 2. 텍스트 정제 및 데이터 제외 규칙
- **운영시간 추출**: 메뉴 텍스트에 "(운영시간 00:00~00:00)" 문구가 있다면:
  1. 시간을 추출하여 해당 'mealOfferingList' 요소의 'startTime', 'endTime'으로 설정하세요.
  2. 추출된 운영시간 문구는 'mealItemList'에 포함하지 마세요.
- **예외 처리**: 
  1. "스넥코너"와 같이 코너명을 반복하는 텍스트는 메뉴 리스트에서 제외하세요.
  2. 여러 항목이 슬래시(/)로 나열된 경우(예: 떡볶이/순대), 이를 분리하지 말고 하나의 문자열 그대로 하나의 MealItem으로 생성하세요.
- **제외 대상**: 데이터가 비어있거나 "공휴일", "휴무" 등 메뉴가 없는 날은 'MealOffering'을 생성하지 마세요.

### 3. 데이터 구조화 규칙
- **계층 구조**: 동일한 코너명을 기준으로 그룹화하고, 그 내부에 날짜별 'mealOfferingList'를 구성하세요.
- **날짜 포맷**: 모든 날짜는 'YYYY-MM-DD' 포맷을 유지하세요.
- **기본 시간**: 추출된 시간이 없을 경우, 코너별 표준 운영시간을 기본값으로 할당하세요.

### JSON 출력 스키마
{
  "stations": [
    {
      "name": "코너명",
      "cafeteriaIdx": ${cafeteriaIdx},
      "mealType": 1,
      "startDate": "2026-05-04",
      "endDate": "2026-05-08",
      "mealOfferingList": [
        {
          "servedDate": "YYYY-MM-DD",
          "startTime": "HH:mm",
          "endTime": "HH:mm",
          "mealItemList": [
            { "name": "메인메뉴명", "price": 지정된가격 },
            { "name": "반찬명", "price": null }
          ]
        }
      ]
    }
  ]
}
`.trim();
