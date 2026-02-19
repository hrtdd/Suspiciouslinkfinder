// Dummy scan results for demo (no backend)
export const DUMMY_SAFE = {
  riskScore: 12,
  status: "SAFE",
  domainAge: "4 years, 2 months",
  sslStatus: "Valid",
  cookieBehavior: "Minimal, first-party only",
  hostingLocation: "US (AWS us-east-1)",
  breakdown: {
    lexicalRisk: 8,
    domainTrust: 95,
    sslIntegrity: 98,
    behavioralAnalysis: 15,
  },
  scannedUrl: "https://example.com",
};

export const DUMMY_MALICIOUS = {
  riskScore: 87,
  status: "MALICIOUS",
  domainAge: "12 days",
  sslStatus: "Self-signed / Invalid",
  cookieBehavior: "Excessive third-party tracking",
  hostingLocation: "Unknown / Bulletproof hosting",
  breakdown: {
    lexicalRisk: 92,
    domainTrust: 5,
    sslIntegrity: 12,
    behavioralAnalysis: 88,
  },
  scannedUrl: "https://suspicious-phishing-site.xyz",
};

// Alternate for variety
export const DUMMY_MODERATE = {
  riskScore: 45,
  status: "SAFE",
  domainAge: "1 year, 6 months",
  sslStatus: "Valid",
  cookieBehavior: "Moderate third-party",
  hostingLocation: "EU (Germany)",
  breakdown: {
    lexicalRisk: 35,
    domainTrust: 62,
    sslIntegrity: 85,
    behavioralAnalysis: 42,
  },
  scannedUrl: "https://some-site.org",
};

export function getDummyResult(url) {
  const lower = (url || "").toLowerCase();
  if (lower.includes("phish") || lower.includes("malicious") || lower.includes("evil")) {
    return { ...DUMMY_MALICIOUS, scannedUrl: url || DUMMY_MALICIOUS.scannedUrl };
  }
  if (lower.includes("moderate") || lower.includes("medium")) {
    return { ...DUMMY_MODERATE, scannedUrl: url || DUMMY_MODERATE.scannedUrl };
  }
  return { ...DUMMY_SAFE, scannedUrl: url || DUMMY_SAFE.scannedUrl };
}
