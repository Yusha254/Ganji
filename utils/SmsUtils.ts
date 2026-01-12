import { PermissionsAndroid, Platform } from "react-native";
import SmsAndroid from "react-native-get-sms-android";
import { RawSms, SmsScanRange } from "../interfaces";

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== "android") return false;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: "SMS Permission",
      message: "This app needs access to your SMS to scan M-PESA transactions.",
      buttonPositive: "OK",
      buttonNegative: "Cancel",
    }
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function getMinDate(range: SmsScanRange): number | undefined {
  const now = new Date();

  switch (range) {
    case "two_weeks":
      return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).getTime();

    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    case "three_months": {
      const d = new Date();
      d.setMonth(now.getMonth() - 3);
      return d.getTime();
    }

    case "all":
      return undefined;
  }
}

export async function scanMpesaMessages(
  range: SmsScanRange
): Promise<RawSms[]> {
  if (Platform.OS !== "android") return [];

  const granted = await requestSmsPermission();
  if (!granted) {
    console.warn("❌ SMS permission not granted.");
    return [];
  }

  const minDate = getMinDate(range);

  return new Promise((resolve, reject) => {
    SmsAndroid.list(
      JSON.stringify({
        box: "inbox",
        address: "MPESA",
        ...(minDate ? { minDate } : {}),
        
      }),
      (fail) => {
        console.error("❌ SMS scan failed:", fail);
        reject(fail);
      },
      (_count, smsList) => {
        try {
          if (!smsList || typeof smsList !== "string") {
            resolve([]);
            return;
          }

          const parsed = JSON.parse(smsList);

          if (!Array.isArray(parsed)) {
            resolve([]);
            return;
          }

          const messages = parsed
            .filter(
              (m) =>
                m &&
                typeof m.body === "string" &&
                m.body.trim().length > 0 &&
                typeof m.address === "string" &&
                m.address.toUpperCase() === "MPESA"
            )
            .map((m) => ({
              body: m.body,
              date: m.date,
            }));

          resolve(messages);
        } catch (err) {
          console.error("❌ Failed to parse SMS list:", err);
          reject(err);
        }
      }
    );
  });
}
