export const userRewardIssueTemplate = (
  nickname: string,
  leagueSeasonName: string,
  rewardName: string,
  content: string,
  imageUrlList: string[],
) => `
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>인하밥길 리워드 발급</title>
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
    font-family: Pretendard, 'Apple SD Gothic Neo', Arial, sans-serif;
  ">
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f7f7f7;"
    >
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 100%;
              max-width: 560px;
              overflow: hidden;
              background-color: #ffffff;
              border: 1px solid #e3e3e3;
              border-radius: 16px;
            "
          >
            <tr>
              <td style="padding: 40px 32px;">
                <h2 style="
                  margin: 0 0 12px;
                  color: #333333;
                  font-size: 20px;
                  line-height: 28px;
                  letter-spacing: -0.4px;
                  font-weight: 600;
                ">
                  리워드가 발급되었습니다
                </h2>

                <p style="
                  margin: 0;
                  color: #6a6a6a;
                  font-size: 15px;
                  line-height: 21px;
                  letter-spacing: -0.3px;
                  font-weight: 500;
                ">
                  ${nickname}님, ${leagueSeasonName} 참여를 통해<br />
                  선택하신 리워드가 발급되었어요.
                </p>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    margin: 32px 0;
                    background-color: #f2f7fd;
                    border: 1px solid #c2d9f5;
                    border-radius: 12px;
                  "
                >
                  <tr>
                    <td align="center" style="padding: 24px;">
                      <p style="
                        margin: 0 0 10px;
                        color: #767676;
                        font-size: 13px;
                        line-height: 16px;
                        letter-spacing: -0.26px;
                        font-weight: 600;
                      ">
                        리워드 상품
                      </p>

                      <p style="
                        margin: 0;
                        color: #1c63b7;
                        font-size: 20px;
                        line-height: 28px;
                        letter-spacing: -0.4px;
                        font-weight: 600;
                      ">
                        ${rewardName}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="
                  margin: 0 0 24px;
                  color: #555555;
                  font-size: 14px;
                  line-height: 21px;
                  letter-spacing: -0.28px;
                  font-weight: 400;
                  white-space: pre-line;
                ">${content}</p>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin: 0 0 24px;"
                >
                  ${imageUrlList
                    .map(
                      (imageUrl, index) => `
                        <tr>
                          <td align="center" style="padding: ${index === 0 ? '0' : '16px 0 0'};">
                            <img
                              src="${imageUrl}"
                              alt="${rewardName} 이미지 ${index + 1}"
                              width="496"
                              style="
                                display: block;
                                width: 100%;
                                max-width: 496px;
                                height: auto;
                                border: 0;
                                border-radius: 12px;
                              "
                            />
                          </td>
                        </tr>
                      `,
                    )
                    .join('')}
                </table>

                <p style="
                  margin: 0;
                  color: #818181;
                  font-size: 12px;
                  line-height: 17px;
                  letter-spacing: -0.24px;
                  font-weight: 400;
                ">
                  위 리워드 이미지를 저장하여 사용해 주세요.<br />
                  이미지 사용에 문제가 있다면 인하밥길에 문의해 주세요.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
