export type BreakTimeTb = {
  idx: number;
  place_idx: number;
  start_at: number; // Debezium 에서 넘어오는 값은 number 타입이기 때문
  end_at: number;
  day: number;
};
