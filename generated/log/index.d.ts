
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model EventTypes
 * 
 */
export type EventTypes = $Result.DefaultSelection<Prisma.$EventTypesPayload>
/**
 * Model FactEvents
 * 
 */
export type FactEvents = $Result.DefaultSelection<Prisma.$FactEventsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EventTypes
 * const eventTypes = await prisma.eventTypes.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more EventTypes
   * const eventTypes = await prisma.eventTypes.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.eventTypes`: Exposes CRUD operations for the **EventTypes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventTypes
    * const eventTypes = await prisma.eventTypes.findMany()
    * ```
    */
  get eventTypes(): Prisma.EventTypesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.factEvents`: Exposes CRUD operations for the **FactEvents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FactEvents
    * const factEvents = await prisma.factEvents.findMany()
    * ```
    */
  get factEvents(): Prisma.FactEventsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    EventTypes: 'EventTypes',
    FactEvents: 'FactEvents'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "eventTypes" | "factEvents"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      EventTypes: {
        payload: Prisma.$EventTypesPayload<ExtArgs>
        fields: Prisma.EventTypesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventTypesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventTypesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>
          }
          findFirst: {
            args: Prisma.EventTypesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventTypesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>
          }
          findMany: {
            args: Prisma.EventTypesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>[]
          }
          create: {
            args: Prisma.EventTypesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>
          }
          createMany: {
            args: Prisma.EventTypesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventTypesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>[]
          }
          delete: {
            args: Prisma.EventTypesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>
          }
          update: {
            args: Prisma.EventTypesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>
          }
          deleteMany: {
            args: Prisma.EventTypesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventTypesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventTypesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>[]
          }
          upsert: {
            args: Prisma.EventTypesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypesPayload>
          }
          aggregate: {
            args: Prisma.EventTypesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventTypes>
          }
          groupBy: {
            args: Prisma.EventTypesGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventTypesGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventTypesCountArgs<ExtArgs>
            result: $Utils.Optional<EventTypesCountAggregateOutputType> | number
          }
        }
      }
      FactEvents: {
        payload: Prisma.$FactEventsPayload<ExtArgs>
        fields: Prisma.FactEventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FactEventsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FactEventsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>
          }
          findFirst: {
            args: Prisma.FactEventsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FactEventsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>
          }
          findMany: {
            args: Prisma.FactEventsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>[]
          }
          create: {
            args: Prisma.FactEventsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>
          }
          createMany: {
            args: Prisma.FactEventsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FactEventsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>[]
          }
          delete: {
            args: Prisma.FactEventsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>
          }
          update: {
            args: Prisma.FactEventsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>
          }
          deleteMany: {
            args: Prisma.FactEventsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FactEventsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FactEventsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>[]
          }
          upsert: {
            args: Prisma.FactEventsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FactEventsPayload>
          }
          aggregate: {
            args: Prisma.FactEventsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFactEvents>
          }
          groupBy: {
            args: Prisma.FactEventsGroupByArgs<ExtArgs>
            result: $Utils.Optional<FactEventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.FactEventsCountArgs<ExtArgs>
            result: $Utils.Optional<FactEventsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    eventTypes?: EventTypesOmit
    factEvents?: FactEventsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model EventTypes
   */

  export type AggregateEventTypes = {
    _count: EventTypesCountAggregateOutputType | null
    _avg: EventTypesAvgAggregateOutputType | null
    _sum: EventTypesSumAggregateOutputType | null
    _min: EventTypesMinAggregateOutputType | null
    _max: EventTypesMaxAggregateOutputType | null
  }

  export type EventTypesAvgAggregateOutputType = {
    idx: number | null
  }

  export type EventTypesSumAggregateOutputType = {
    idx: number | null
  }

  export type EventTypesMinAggregateOutputType = {
    idx: number | null
    name: string | null
  }

  export type EventTypesMaxAggregateOutputType = {
    idx: number | null
    name: string | null
  }

  export type EventTypesCountAggregateOutputType = {
    idx: number
    name: number
    _all: number
  }


  export type EventTypesAvgAggregateInputType = {
    idx?: true
  }

  export type EventTypesSumAggregateInputType = {
    idx?: true
  }

  export type EventTypesMinAggregateInputType = {
    idx?: true
    name?: true
  }

  export type EventTypesMaxAggregateInputType = {
    idx?: true
    name?: true
  }

  export type EventTypesCountAggregateInputType = {
    idx?: true
    name?: true
    _all?: true
  }

  export type EventTypesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventTypes to aggregate.
     */
    where?: EventTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypesOrderByWithRelationInput | EventTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventTypes
    **/
    _count?: true | EventTypesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventTypesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventTypesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventTypesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventTypesMaxAggregateInputType
  }

  export type GetEventTypesAggregateType<T extends EventTypesAggregateArgs> = {
        [P in keyof T & keyof AggregateEventTypes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventTypes[P]>
      : GetScalarType<T[P], AggregateEventTypes[P]>
  }




  export type EventTypesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventTypesWhereInput
    orderBy?: EventTypesOrderByWithAggregationInput | EventTypesOrderByWithAggregationInput[]
    by: EventTypesScalarFieldEnum[] | EventTypesScalarFieldEnum
    having?: EventTypesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventTypesCountAggregateInputType | true
    _avg?: EventTypesAvgAggregateInputType
    _sum?: EventTypesSumAggregateInputType
    _min?: EventTypesMinAggregateInputType
    _max?: EventTypesMaxAggregateInputType
  }

  export type EventTypesGroupByOutputType = {
    idx: number
    name: string
    _count: EventTypesCountAggregateOutputType | null
    _avg: EventTypesAvgAggregateOutputType | null
    _sum: EventTypesSumAggregateOutputType | null
    _min: EventTypesMinAggregateOutputType | null
    _max: EventTypesMaxAggregateOutputType | null
  }

  type GetEventTypesGroupByPayload<T extends EventTypesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventTypesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventTypesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventTypesGroupByOutputType[P]>
            : GetScalarType<T[P], EventTypesGroupByOutputType[P]>
        }
      >
    >


  export type EventTypesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idx?: boolean
    name?: boolean
  }, ExtArgs["result"]["eventTypes"]>

  export type EventTypesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idx?: boolean
    name?: boolean
  }, ExtArgs["result"]["eventTypes"]>

  export type EventTypesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idx?: boolean
    name?: boolean
  }, ExtArgs["result"]["eventTypes"]>

  export type EventTypesSelectScalar = {
    idx?: boolean
    name?: boolean
  }

  export type EventTypesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idx" | "name", ExtArgs["result"]["eventTypes"]>

  export type $EventTypesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventTypes"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      idx: number
      name: string
    }, ExtArgs["result"]["eventTypes"]>
    composites: {}
  }

  type EventTypesGetPayload<S extends boolean | null | undefined | EventTypesDefaultArgs> = $Result.GetResult<Prisma.$EventTypesPayload, S>

  type EventTypesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventTypesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventTypesCountAggregateInputType | true
    }

  export interface EventTypesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventTypes'], meta: { name: 'EventTypes' } }
    /**
     * Find zero or one EventTypes that matches the filter.
     * @param {EventTypesFindUniqueArgs} args - Arguments to find a EventTypes
     * @example
     * // Get one EventTypes
     * const eventTypes = await prisma.eventTypes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventTypesFindUniqueArgs>(args: SelectSubset<T, EventTypesFindUniqueArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventTypes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventTypesFindUniqueOrThrowArgs} args - Arguments to find a EventTypes
     * @example
     * // Get one EventTypes
     * const eventTypes = await prisma.eventTypes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventTypesFindUniqueOrThrowArgs>(args: SelectSubset<T, EventTypesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesFindFirstArgs} args - Arguments to find a EventTypes
     * @example
     * // Get one EventTypes
     * const eventTypes = await prisma.eventTypes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventTypesFindFirstArgs>(args?: SelectSubset<T, EventTypesFindFirstArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventTypes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesFindFirstOrThrowArgs} args - Arguments to find a EventTypes
     * @example
     * // Get one EventTypes
     * const eventTypes = await prisma.eventTypes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventTypesFindFirstOrThrowArgs>(args?: SelectSubset<T, EventTypesFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventTypes
     * const eventTypes = await prisma.eventTypes.findMany()
     * 
     * // Get first 10 EventTypes
     * const eventTypes = await prisma.eventTypes.findMany({ take: 10 })
     * 
     * // Only select the `idx`
     * const eventTypesWithIdxOnly = await prisma.eventTypes.findMany({ select: { idx: true } })
     * 
     */
    findMany<T extends EventTypesFindManyArgs>(args?: SelectSubset<T, EventTypesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventTypes.
     * @param {EventTypesCreateArgs} args - Arguments to create a EventTypes.
     * @example
     * // Create one EventTypes
     * const EventTypes = await prisma.eventTypes.create({
     *   data: {
     *     // ... data to create a EventTypes
     *   }
     * })
     * 
     */
    create<T extends EventTypesCreateArgs>(args: SelectSubset<T, EventTypesCreateArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventTypes.
     * @param {EventTypesCreateManyArgs} args - Arguments to create many EventTypes.
     * @example
     * // Create many EventTypes
     * const eventTypes = await prisma.eventTypes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventTypesCreateManyArgs>(args?: SelectSubset<T, EventTypesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventTypes and returns the data saved in the database.
     * @param {EventTypesCreateManyAndReturnArgs} args - Arguments to create many EventTypes.
     * @example
     * // Create many EventTypes
     * const eventTypes = await prisma.eventTypes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventTypes and only return the `idx`
     * const eventTypesWithIdxOnly = await prisma.eventTypes.createManyAndReturn({
     *   select: { idx: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventTypesCreateManyAndReturnArgs>(args?: SelectSubset<T, EventTypesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventTypes.
     * @param {EventTypesDeleteArgs} args - Arguments to delete one EventTypes.
     * @example
     * // Delete one EventTypes
     * const EventTypes = await prisma.eventTypes.delete({
     *   where: {
     *     // ... filter to delete one EventTypes
     *   }
     * })
     * 
     */
    delete<T extends EventTypesDeleteArgs>(args: SelectSubset<T, EventTypesDeleteArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventTypes.
     * @param {EventTypesUpdateArgs} args - Arguments to update one EventTypes.
     * @example
     * // Update one EventTypes
     * const eventTypes = await prisma.eventTypes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventTypesUpdateArgs>(args: SelectSubset<T, EventTypesUpdateArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventTypes.
     * @param {EventTypesDeleteManyArgs} args - Arguments to filter EventTypes to delete.
     * @example
     * // Delete a few EventTypes
     * const { count } = await prisma.eventTypes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventTypesDeleteManyArgs>(args?: SelectSubset<T, EventTypesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventTypes
     * const eventTypes = await prisma.eventTypes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventTypesUpdateManyArgs>(args: SelectSubset<T, EventTypesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventTypes and returns the data updated in the database.
     * @param {EventTypesUpdateManyAndReturnArgs} args - Arguments to update many EventTypes.
     * @example
     * // Update many EventTypes
     * const eventTypes = await prisma.eventTypes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventTypes and only return the `idx`
     * const eventTypesWithIdxOnly = await prisma.eventTypes.updateManyAndReturn({
     *   select: { idx: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventTypesUpdateManyAndReturnArgs>(args: SelectSubset<T, EventTypesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventTypes.
     * @param {EventTypesUpsertArgs} args - Arguments to update or create a EventTypes.
     * @example
     * // Update or create a EventTypes
     * const eventTypes = await prisma.eventTypes.upsert({
     *   create: {
     *     // ... data to create a EventTypes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventTypes we want to update
     *   }
     * })
     */
    upsert<T extends EventTypesUpsertArgs>(args: SelectSubset<T, EventTypesUpsertArgs<ExtArgs>>): Prisma__EventTypesClient<$Result.GetResult<Prisma.$EventTypesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesCountArgs} args - Arguments to filter EventTypes to count.
     * @example
     * // Count the number of EventTypes
     * const count = await prisma.eventTypes.count({
     *   where: {
     *     // ... the filter for the EventTypes we want to count
     *   }
     * })
    **/
    count<T extends EventTypesCountArgs>(
      args?: Subset<T, EventTypesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventTypesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventTypesAggregateArgs>(args: Subset<T, EventTypesAggregateArgs>): Prisma.PrismaPromise<GetEventTypesAggregateType<T>>

    /**
     * Group by EventTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventTypesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventTypesGroupByArgs['orderBy'] }
        : { orderBy?: EventTypesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventTypesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventTypesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventTypes model
   */
  readonly fields: EventTypesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventTypes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventTypesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventTypes model
   */
  interface EventTypesFieldRefs {
    readonly idx: FieldRef<"EventTypes", 'Int'>
    readonly name: FieldRef<"EventTypes", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EventTypes findUnique
   */
  export type EventTypesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * Filter, which EventTypes to fetch.
     */
    where: EventTypesWhereUniqueInput
  }

  /**
   * EventTypes findUniqueOrThrow
   */
  export type EventTypesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * Filter, which EventTypes to fetch.
     */
    where: EventTypesWhereUniqueInput
  }

  /**
   * EventTypes findFirst
   */
  export type EventTypesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * Filter, which EventTypes to fetch.
     */
    where?: EventTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypesOrderByWithRelationInput | EventTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventTypes.
     */
    cursor?: EventTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTypes.
     */
    distinct?: EventTypesScalarFieldEnum | EventTypesScalarFieldEnum[]
  }

  /**
   * EventTypes findFirstOrThrow
   */
  export type EventTypesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * Filter, which EventTypes to fetch.
     */
    where?: EventTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypesOrderByWithRelationInput | EventTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventTypes.
     */
    cursor?: EventTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTypes.
     */
    distinct?: EventTypesScalarFieldEnum | EventTypesScalarFieldEnum[]
  }

  /**
   * EventTypes findMany
   */
  export type EventTypesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * Filter, which EventTypes to fetch.
     */
    where?: EventTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypesOrderByWithRelationInput | EventTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventTypes.
     */
    cursor?: EventTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    distinct?: EventTypesScalarFieldEnum | EventTypesScalarFieldEnum[]
  }

  /**
   * EventTypes create
   */
  export type EventTypesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * The data needed to create a EventTypes.
     */
    data: XOR<EventTypesCreateInput, EventTypesUncheckedCreateInput>
  }

  /**
   * EventTypes createMany
   */
  export type EventTypesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventTypes.
     */
    data: EventTypesCreateManyInput | EventTypesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventTypes createManyAndReturn
   */
  export type EventTypesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * The data used to create many EventTypes.
     */
    data: EventTypesCreateManyInput | EventTypesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventTypes update
   */
  export type EventTypesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * The data needed to update a EventTypes.
     */
    data: XOR<EventTypesUpdateInput, EventTypesUncheckedUpdateInput>
    /**
     * Choose, which EventTypes to update.
     */
    where: EventTypesWhereUniqueInput
  }

  /**
   * EventTypes updateMany
   */
  export type EventTypesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventTypes.
     */
    data: XOR<EventTypesUpdateManyMutationInput, EventTypesUncheckedUpdateManyInput>
    /**
     * Filter which EventTypes to update
     */
    where?: EventTypesWhereInput
    /**
     * Limit how many EventTypes to update.
     */
    limit?: number
  }

  /**
   * EventTypes updateManyAndReturn
   */
  export type EventTypesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * The data used to update EventTypes.
     */
    data: XOR<EventTypesUpdateManyMutationInput, EventTypesUncheckedUpdateManyInput>
    /**
     * Filter which EventTypes to update
     */
    where?: EventTypesWhereInput
    /**
     * Limit how many EventTypes to update.
     */
    limit?: number
  }

  /**
   * EventTypes upsert
   */
  export type EventTypesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * The filter to search for the EventTypes to update in case it exists.
     */
    where: EventTypesWhereUniqueInput
    /**
     * In case the EventTypes found by the `where` argument doesn't exist, create a new EventTypes with this data.
     */
    create: XOR<EventTypesCreateInput, EventTypesUncheckedCreateInput>
    /**
     * In case the EventTypes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventTypesUpdateInput, EventTypesUncheckedUpdateInput>
  }

  /**
   * EventTypes delete
   */
  export type EventTypesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
    /**
     * Filter which EventTypes to delete.
     */
    where: EventTypesWhereUniqueInput
  }

  /**
   * EventTypes deleteMany
   */
  export type EventTypesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventTypes to delete
     */
    where?: EventTypesWhereInput
    /**
     * Limit how many EventTypes to delete.
     */
    limit?: number
  }

  /**
   * EventTypes without action
   */
  export type EventTypesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypes
     */
    select?: EventTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventTypes
     */
    omit?: EventTypesOmit<ExtArgs> | null
  }


  /**
   * Model FactEvents
   */

  export type AggregateFactEvents = {
    _count: FactEventsCountAggregateOutputType | null
    _min: FactEventsMinAggregateOutputType | null
    _max: FactEventsMaxAggregateOutputType | null
  }

  export type FactEventsMinAggregateOutputType = {
    id: string | null
  }

  export type FactEventsMaxAggregateOutputType = {
    id: string | null
  }

  export type FactEventsCountAggregateOutputType = {
    id: number
    _all: number
  }


  export type FactEventsMinAggregateInputType = {
    id?: true
  }

  export type FactEventsMaxAggregateInputType = {
    id?: true
  }

  export type FactEventsCountAggregateInputType = {
    id?: true
    _all?: true
  }

  export type FactEventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FactEvents to aggregate.
     */
    where?: FactEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FactEvents to fetch.
     */
    orderBy?: FactEventsOrderByWithRelationInput | FactEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FactEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FactEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FactEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FactEvents
    **/
    _count?: true | FactEventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FactEventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FactEventsMaxAggregateInputType
  }

  export type GetFactEventsAggregateType<T extends FactEventsAggregateArgs> = {
        [P in keyof T & keyof AggregateFactEvents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFactEvents[P]>
      : GetScalarType<T[P], AggregateFactEvents[P]>
  }




  export type FactEventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FactEventsWhereInput
    orderBy?: FactEventsOrderByWithAggregationInput | FactEventsOrderByWithAggregationInput[]
    by: FactEventsScalarFieldEnum[] | FactEventsScalarFieldEnum
    having?: FactEventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FactEventsCountAggregateInputType | true
    _min?: FactEventsMinAggregateInputType
    _max?: FactEventsMaxAggregateInputType
  }

  export type FactEventsGroupByOutputType = {
    id: string
    _count: FactEventsCountAggregateOutputType | null
    _min: FactEventsMinAggregateOutputType | null
    _max: FactEventsMaxAggregateOutputType | null
  }

  type GetFactEventsGroupByPayload<T extends FactEventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FactEventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FactEventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FactEventsGroupByOutputType[P]>
            : GetScalarType<T[P], FactEventsGroupByOutputType[P]>
        }
      >
    >


  export type FactEventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
  }, ExtArgs["result"]["factEvents"]>

  export type FactEventsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
  }, ExtArgs["result"]["factEvents"]>

  export type FactEventsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
  }, ExtArgs["result"]["factEvents"]>

  export type FactEventsSelectScalar = {
    id?: boolean
  }

  export type FactEventsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id", ExtArgs["result"]["factEvents"]>

  export type $FactEventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FactEvents"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
    }, ExtArgs["result"]["factEvents"]>
    composites: {}
  }

  type FactEventsGetPayload<S extends boolean | null | undefined | FactEventsDefaultArgs> = $Result.GetResult<Prisma.$FactEventsPayload, S>

  type FactEventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FactEventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FactEventsCountAggregateInputType | true
    }

  export interface FactEventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FactEvents'], meta: { name: 'FactEvents' } }
    /**
     * Find zero or one FactEvents that matches the filter.
     * @param {FactEventsFindUniqueArgs} args - Arguments to find a FactEvents
     * @example
     * // Get one FactEvents
     * const factEvents = await prisma.factEvents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FactEventsFindUniqueArgs>(args: SelectSubset<T, FactEventsFindUniqueArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FactEvents that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FactEventsFindUniqueOrThrowArgs} args - Arguments to find a FactEvents
     * @example
     * // Get one FactEvents
     * const factEvents = await prisma.factEvents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FactEventsFindUniqueOrThrowArgs>(args: SelectSubset<T, FactEventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FactEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsFindFirstArgs} args - Arguments to find a FactEvents
     * @example
     * // Get one FactEvents
     * const factEvents = await prisma.factEvents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FactEventsFindFirstArgs>(args?: SelectSubset<T, FactEventsFindFirstArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FactEvents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsFindFirstOrThrowArgs} args - Arguments to find a FactEvents
     * @example
     * // Get one FactEvents
     * const factEvents = await prisma.factEvents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FactEventsFindFirstOrThrowArgs>(args?: SelectSubset<T, FactEventsFindFirstOrThrowArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FactEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FactEvents
     * const factEvents = await prisma.factEvents.findMany()
     * 
     * // Get first 10 FactEvents
     * const factEvents = await prisma.factEvents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const factEventsWithIdOnly = await prisma.factEvents.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FactEventsFindManyArgs>(args?: SelectSubset<T, FactEventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FactEvents.
     * @param {FactEventsCreateArgs} args - Arguments to create a FactEvents.
     * @example
     * // Create one FactEvents
     * const FactEvents = await prisma.factEvents.create({
     *   data: {
     *     // ... data to create a FactEvents
     *   }
     * })
     * 
     */
    create<T extends FactEventsCreateArgs>(args: SelectSubset<T, FactEventsCreateArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FactEvents.
     * @param {FactEventsCreateManyArgs} args - Arguments to create many FactEvents.
     * @example
     * // Create many FactEvents
     * const factEvents = await prisma.factEvents.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FactEventsCreateManyArgs>(args?: SelectSubset<T, FactEventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FactEvents and returns the data saved in the database.
     * @param {FactEventsCreateManyAndReturnArgs} args - Arguments to create many FactEvents.
     * @example
     * // Create many FactEvents
     * const factEvents = await prisma.factEvents.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FactEvents and only return the `id`
     * const factEventsWithIdOnly = await prisma.factEvents.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FactEventsCreateManyAndReturnArgs>(args?: SelectSubset<T, FactEventsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FactEvents.
     * @param {FactEventsDeleteArgs} args - Arguments to delete one FactEvents.
     * @example
     * // Delete one FactEvents
     * const FactEvents = await prisma.factEvents.delete({
     *   where: {
     *     // ... filter to delete one FactEvents
     *   }
     * })
     * 
     */
    delete<T extends FactEventsDeleteArgs>(args: SelectSubset<T, FactEventsDeleteArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FactEvents.
     * @param {FactEventsUpdateArgs} args - Arguments to update one FactEvents.
     * @example
     * // Update one FactEvents
     * const factEvents = await prisma.factEvents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FactEventsUpdateArgs>(args: SelectSubset<T, FactEventsUpdateArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FactEvents.
     * @param {FactEventsDeleteManyArgs} args - Arguments to filter FactEvents to delete.
     * @example
     * // Delete a few FactEvents
     * const { count } = await prisma.factEvents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FactEventsDeleteManyArgs>(args?: SelectSubset<T, FactEventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FactEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FactEvents
     * const factEvents = await prisma.factEvents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FactEventsUpdateManyArgs>(args: SelectSubset<T, FactEventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FactEvents and returns the data updated in the database.
     * @param {FactEventsUpdateManyAndReturnArgs} args - Arguments to update many FactEvents.
     * @example
     * // Update many FactEvents
     * const factEvents = await prisma.factEvents.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FactEvents and only return the `id`
     * const factEventsWithIdOnly = await prisma.factEvents.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FactEventsUpdateManyAndReturnArgs>(args: SelectSubset<T, FactEventsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FactEvents.
     * @param {FactEventsUpsertArgs} args - Arguments to update or create a FactEvents.
     * @example
     * // Update or create a FactEvents
     * const factEvents = await prisma.factEvents.upsert({
     *   create: {
     *     // ... data to create a FactEvents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FactEvents we want to update
     *   }
     * })
     */
    upsert<T extends FactEventsUpsertArgs>(args: SelectSubset<T, FactEventsUpsertArgs<ExtArgs>>): Prisma__FactEventsClient<$Result.GetResult<Prisma.$FactEventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FactEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsCountArgs} args - Arguments to filter FactEvents to count.
     * @example
     * // Count the number of FactEvents
     * const count = await prisma.factEvents.count({
     *   where: {
     *     // ... the filter for the FactEvents we want to count
     *   }
     * })
    **/
    count<T extends FactEventsCountArgs>(
      args?: Subset<T, FactEventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FactEventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FactEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FactEventsAggregateArgs>(args: Subset<T, FactEventsAggregateArgs>): Prisma.PrismaPromise<GetFactEventsAggregateType<T>>

    /**
     * Group by FactEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FactEventsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FactEventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FactEventsGroupByArgs['orderBy'] }
        : { orderBy?: FactEventsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FactEventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFactEventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FactEvents model
   */
  readonly fields: FactEventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FactEvents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FactEventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FactEvents model
   */
  interface FactEventsFieldRefs {
    readonly id: FieldRef<"FactEvents", 'String'>
  }
    

  // Custom InputTypes
  /**
   * FactEvents findUnique
   */
  export type FactEventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * Filter, which FactEvents to fetch.
     */
    where: FactEventsWhereUniqueInput
  }

  /**
   * FactEvents findUniqueOrThrow
   */
  export type FactEventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * Filter, which FactEvents to fetch.
     */
    where: FactEventsWhereUniqueInput
  }

  /**
   * FactEvents findFirst
   */
  export type FactEventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * Filter, which FactEvents to fetch.
     */
    where?: FactEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FactEvents to fetch.
     */
    orderBy?: FactEventsOrderByWithRelationInput | FactEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FactEvents.
     */
    cursor?: FactEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FactEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FactEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FactEvents.
     */
    distinct?: FactEventsScalarFieldEnum | FactEventsScalarFieldEnum[]
  }

  /**
   * FactEvents findFirstOrThrow
   */
  export type FactEventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * Filter, which FactEvents to fetch.
     */
    where?: FactEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FactEvents to fetch.
     */
    orderBy?: FactEventsOrderByWithRelationInput | FactEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FactEvents.
     */
    cursor?: FactEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FactEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FactEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FactEvents.
     */
    distinct?: FactEventsScalarFieldEnum | FactEventsScalarFieldEnum[]
  }

  /**
   * FactEvents findMany
   */
  export type FactEventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * Filter, which FactEvents to fetch.
     */
    where?: FactEventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FactEvents to fetch.
     */
    orderBy?: FactEventsOrderByWithRelationInput | FactEventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FactEvents.
     */
    cursor?: FactEventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FactEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FactEvents.
     */
    skip?: number
    distinct?: FactEventsScalarFieldEnum | FactEventsScalarFieldEnum[]
  }

  /**
   * FactEvents create
   */
  export type FactEventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * The data needed to create a FactEvents.
     */
    data?: XOR<FactEventsCreateInput, FactEventsUncheckedCreateInput>
  }

  /**
   * FactEvents createMany
   */
  export type FactEventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FactEvents.
     */
    data: FactEventsCreateManyInput | FactEventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FactEvents createManyAndReturn
   */
  export type FactEventsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * The data used to create many FactEvents.
     */
    data: FactEventsCreateManyInput | FactEventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FactEvents update
   */
  export type FactEventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * The data needed to update a FactEvents.
     */
    data: XOR<FactEventsUpdateInput, FactEventsUncheckedUpdateInput>
    /**
     * Choose, which FactEvents to update.
     */
    where: FactEventsWhereUniqueInput
  }

  /**
   * FactEvents updateMany
   */
  export type FactEventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FactEvents.
     */
    data: XOR<FactEventsUpdateManyMutationInput, FactEventsUncheckedUpdateManyInput>
    /**
     * Filter which FactEvents to update
     */
    where?: FactEventsWhereInput
    /**
     * Limit how many FactEvents to update.
     */
    limit?: number
  }

  /**
   * FactEvents updateManyAndReturn
   */
  export type FactEventsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * The data used to update FactEvents.
     */
    data: XOR<FactEventsUpdateManyMutationInput, FactEventsUncheckedUpdateManyInput>
    /**
     * Filter which FactEvents to update
     */
    where?: FactEventsWhereInput
    /**
     * Limit how many FactEvents to update.
     */
    limit?: number
  }

  /**
   * FactEvents upsert
   */
  export type FactEventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * The filter to search for the FactEvents to update in case it exists.
     */
    where: FactEventsWhereUniqueInput
    /**
     * In case the FactEvents found by the `where` argument doesn't exist, create a new FactEvents with this data.
     */
    create: XOR<FactEventsCreateInput, FactEventsUncheckedCreateInput>
    /**
     * In case the FactEvents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FactEventsUpdateInput, FactEventsUncheckedUpdateInput>
  }

  /**
   * FactEvents delete
   */
  export type FactEventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
    /**
     * Filter which FactEvents to delete.
     */
    where: FactEventsWhereUniqueInput
  }

  /**
   * FactEvents deleteMany
   */
  export type FactEventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FactEvents to delete
     */
    where?: FactEventsWhereInput
    /**
     * Limit how many FactEvents to delete.
     */
    limit?: number
  }

  /**
   * FactEvents without action
   */
  export type FactEventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FactEvents
     */
    select?: FactEventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FactEvents
     */
    omit?: FactEventsOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EventTypesScalarFieldEnum: {
    idx: 'idx',
    name: 'name'
  };

  export type EventTypesScalarFieldEnum = (typeof EventTypesScalarFieldEnum)[keyof typeof EventTypesScalarFieldEnum]


  export const FactEventsScalarFieldEnum: {
    id: 'id'
  };

  export type FactEventsScalarFieldEnum = (typeof FactEventsScalarFieldEnum)[keyof typeof FactEventsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type EventTypesWhereInput = {
    AND?: EventTypesWhereInput | EventTypesWhereInput[]
    OR?: EventTypesWhereInput[]
    NOT?: EventTypesWhereInput | EventTypesWhereInput[]
    idx?: IntFilter<"EventTypes"> | number
    name?: StringFilter<"EventTypes"> | string
  }

  export type EventTypesOrderByWithRelationInput = {
    idx?: SortOrder
    name?: SortOrder
  }

  export type EventTypesWhereUniqueInput = Prisma.AtLeast<{
    idx?: number
    AND?: EventTypesWhereInput | EventTypesWhereInput[]
    OR?: EventTypesWhereInput[]
    NOT?: EventTypesWhereInput | EventTypesWhereInput[]
    name?: StringFilter<"EventTypes"> | string
  }, "idx">

  export type EventTypesOrderByWithAggregationInput = {
    idx?: SortOrder
    name?: SortOrder
    _count?: EventTypesCountOrderByAggregateInput
    _avg?: EventTypesAvgOrderByAggregateInput
    _max?: EventTypesMaxOrderByAggregateInput
    _min?: EventTypesMinOrderByAggregateInput
    _sum?: EventTypesSumOrderByAggregateInput
  }

  export type EventTypesScalarWhereWithAggregatesInput = {
    AND?: EventTypesScalarWhereWithAggregatesInput | EventTypesScalarWhereWithAggregatesInput[]
    OR?: EventTypesScalarWhereWithAggregatesInput[]
    NOT?: EventTypesScalarWhereWithAggregatesInput | EventTypesScalarWhereWithAggregatesInput[]
    idx?: IntWithAggregatesFilter<"EventTypes"> | number
    name?: StringWithAggregatesFilter<"EventTypes"> | string
  }

  export type FactEventsWhereInput = {
    AND?: FactEventsWhereInput | FactEventsWhereInput[]
    OR?: FactEventsWhereInput[]
    NOT?: FactEventsWhereInput | FactEventsWhereInput[]
    id?: UuidFilter<"FactEvents"> | string
  }

  export type FactEventsOrderByWithRelationInput = {
    id?: SortOrder
  }

  export type FactEventsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FactEventsWhereInput | FactEventsWhereInput[]
    OR?: FactEventsWhereInput[]
    NOT?: FactEventsWhereInput | FactEventsWhereInput[]
  }, "id">

  export type FactEventsOrderByWithAggregationInput = {
    id?: SortOrder
    _count?: FactEventsCountOrderByAggregateInput
    _max?: FactEventsMaxOrderByAggregateInput
    _min?: FactEventsMinOrderByAggregateInput
  }

  export type FactEventsScalarWhereWithAggregatesInput = {
    AND?: FactEventsScalarWhereWithAggregatesInput | FactEventsScalarWhereWithAggregatesInput[]
    OR?: FactEventsScalarWhereWithAggregatesInput[]
    NOT?: FactEventsScalarWhereWithAggregatesInput | FactEventsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"FactEvents"> | string
  }

  export type EventTypesCreateInput = {
    name: string
  }

  export type EventTypesUncheckedCreateInput = {
    idx?: number
    name: string
  }

  export type EventTypesUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type EventTypesUncheckedUpdateInput = {
    idx?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type EventTypesCreateManyInput = {
    idx?: number
    name: string
  }

  export type EventTypesUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type EventTypesUncheckedUpdateManyInput = {
    idx?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type FactEventsCreateInput = {
    id?: string
  }

  export type FactEventsUncheckedCreateInput = {
    id?: string
  }

  export type FactEventsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type FactEventsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type FactEventsCreateManyInput = {
    id?: string
  }

  export type FactEventsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type FactEventsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EventTypesCountOrderByAggregateInput = {
    idx?: SortOrder
    name?: SortOrder
  }

  export type EventTypesAvgOrderByAggregateInput = {
    idx?: SortOrder
  }

  export type EventTypesMaxOrderByAggregateInput = {
    idx?: SortOrder
    name?: SortOrder
  }

  export type EventTypesMinOrderByAggregateInput = {
    idx?: SortOrder
    name?: SortOrder
  }

  export type EventTypesSumOrderByAggregateInput = {
    idx?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type FactEventsCountOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FactEventsMaxOrderByAggregateInput = {
    id?: SortOrder
  }

  export type FactEventsMinOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}