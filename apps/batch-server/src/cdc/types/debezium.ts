/** Debezium 공통 Source 필드 (PostgreSQL 기준 + 공통 교집합) */
export interface DebeziumSource {
  version?: string; // connector version
  connector: string; // "postgresql", "mysql", ...
  name: string; // topic.prefix
  ts_ms?: number; // source timestamp (ms)

  db?: string; // database name
  schema?: string; // pg: schema
  table?: string; // table
  txId?: number; // pg: tx id (optional)
  lsn?: number; // pg: LSN (optional)
  xmin?: number | null; // pg: xmin (optional)
  snapshot?: boolean | 'true' | 'false' | 'last' | 'incremental' | null;
}

/** Debezium operation code */
export type DebeziumOp = 'c' | 'u' | 'd' | 'r'; // create/update/delete/read(snapshot)

/** (옵션) transaction 메타가 켜져있을 때 들어올 수 있음 */
export interface DebeziumTransaction {
  id: string;
  total_order: number;
  data_collection_order: number;
}

/** Debezium Change Event payload */
export interface DebeziumPayload<TAfter = unknown, TBefore = unknown> {
  before: TBefore | null;
  after: TAfter | null;
  source: DebeziumSource;
  op: DebeziumOp;

  /** event time (Debezium가 찍는 시간) */
  ts_ms?: number;

  /** update일 때, (옵션) 변경 전 컬럼들만 들어오는 “patch” */
  patch?: Partial<TAfter>;

  /** delete 모드나 설정에 따라 존재할 수 있음 */
  transaction?: DebeziumTransaction | null;
}

/** 최종 메시지 타입 (value) */
export type DebeziumMessage<
  TAfter = unknown,
  TBefore = unknown,
> = DebeziumPayload<TAfter, TBefore>;

/** op별로 좁혀 쓰기 편한 유니온 */
export type DebeziumEvent<T> =
  | ({ op: 'c' | 'r'; after: T; before: null } & Omit<
      DebeziumPayload<T, null>,
      'after' | 'before' | 'op'
    > & { op: 'c' | 'r' })
  | ({ op: 'u'; after: T; before: T | null } & Omit<
      DebeziumPayload<T, T | null>,
      'after' | 'before' | 'op'
    >)
  | ({ op: 'd'; after: null; before: T } & Omit<
      DebeziumPayload<null, T>,
      'after' | 'before' | 'op'
    >);

/** 타입가드 */
export function isDebeziumMessage(x: any): x is DebeziumMessage {
  return (
    x &&
    typeof x === 'object' &&
    'op' in x &&
    'source' in x &&
    ('after' in x || 'before' in x)
  );
}

export function assertNever(v: never): never {
  throw new Error(`Unexpected value: ${String(v)}`);
}
