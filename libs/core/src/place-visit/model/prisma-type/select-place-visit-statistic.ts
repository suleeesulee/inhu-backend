import { PlaceType } from '@libs/core/place/constants/place-type.constant';
import { Prisma } from '@prisma/client';

export type SelectPlaceVisitStatistic = {
  placeType: PlaceType;
  visitCount: number;
};

export const SELECT_PLACE_VISIT_STATISTIC = (
  userIdx: number,
  startAt: Date,
  endAt: Date,
): Prisma.Sql => Prisma.sql`
  SELECT
    pt.idx AS "placeType",
    COUNT(DISTINCT pv.id)::int AS "visitCount"
  FROM place_type_tb AS pt
  LEFT JOIN place_type_mapping_tb AS ptm
    ON ptm.place_type_idx = pt.idx
  LEFT JOIN nfc_tb AS n
    ON n.place_idx = ptm.place_idx
  LEFT JOIN place_visit_tb AS pv
    ON pv.nfc_idx = n.idx
    AND pv.user_idx = ${userIdx}
    AND pv.created_at >= ${startAt}
    AND pv.created_at <= ${endAt}
    AND pv.deleted_at IS NULL
  WHERE pt.idx IN (
    ${PlaceType.CAFE},
    ${PlaceType.RESTAURANT},
    ${PlaceType.BAR}
  )
    AND pt.deleted_at IS NULL
  GROUP BY pt.idx
  ORDER BY pt.idx ASC
`;
