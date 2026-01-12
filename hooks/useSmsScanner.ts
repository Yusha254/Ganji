import { useCallback, useEffect, useState } from "react";
import { IngestResult, SmsScanRange } from "../interfaces";
import { ingestSmsMessages } from "../services/smsIngestService";
import { scanMpesaMessages } from "../utils/SmsUtils";

export function useSmsScanner(defaultRange: SmsScanRange =  "two_weeks", auto = false) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<IngestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanAndSave = useCallback(async (range: SmsScanRange) => {
    try {
      setLoading(true);
      setError(null);

      const messages = await scanMpesaMessages(range);

      const result = await ingestSmsMessages(messages);

      setStats(result);
    } catch (err) {
      console.error(err);
      setError("Scan failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) {
      scanAndSave(defaultRange);
    }
  }, [auto, defaultRange ,scanAndSave]);

  return {
    scanAndSave,
    loading,
    stats,
    error,
  };
}

