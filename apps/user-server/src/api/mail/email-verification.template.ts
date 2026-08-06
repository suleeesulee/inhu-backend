export const emailVerificationTemplate = (verificationCode: string) => `
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>인하밥길 이메일 인증</title>
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
                  이메일 인증 코드입니다
                </h2>

                <p style="
                  margin: 0;
                  color: #6a6a6a;
                  font-size: 15px;
                  line-height: 21px;
                  letter-spacing: -0.3px;
                  font-weight: 500;
                ">
                  인하밥길 이메일 인증을 위해<br />
                  아래 인증 코드를 입력해 주세요.
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
                        인증 코드
                      </p>

                      <p style="
                        margin: 0;
                        color: #1c63b7;
                        font-size: 26px;
                        line-height: 31px;
                        letter-spacing: 8px;
                        font-weight: 600;
                      ">
                        ${verificationCode}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="
                  margin: 0;
                  color: #818181;
                  font-size: 12px;
                  line-height: 17px;
                  letter-spacing: -0.24px;
                  font-weight: 400;
                ">
                  인증 코드는 5분 동안 유효합니다.<br />
                  본인이 요청하지 않았다면 이 메일을 무시해 주세요.
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
