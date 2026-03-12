// PhishGuard Chrome Extension - Combined Link & Email Phishing Detection
// Background Service Worker

const GEMINI_API_KEY = 'AIzaSyDr8CZHW5I4x_z7CLsBpmBGBDoSN7lljEw';
const FIREBASE_PROJECT_ID = 'phisquard';

let phishingLinks = [];
let phishingEmails = [];
let suspiciousKeywords = [];
let phishingPatterns = [];

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('PhishGuard Extension Installed');
  fetchPhishingData();
  setInterval(fetchPhishingData, 5 * 60 * 1000); // Refresh every 5 mins
});

// Fetch phishing data from Firebase
async function fetchPhishingData() {
  try {
    // Fetch phishing links
    const linksRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/phishing_links`
    );
    const linksData = await linksRes.json();
    if (linksData.documents) {
      phishingLinks = linksData.documents.map((doc) => doc.fields.url?.stringValue || '').filter(Boolean);
    }

    // Fetch phishing email domains
    const emailsRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/phishing_emails`
    );
    const emailsData = await emailsRes.json();
    if (emailsData.documents) {
      phishingEmails = emailsData.documents.map((doc) => doc.fields.domain?.stringValue || '').filter(Boolean);
    }

    // Fetch suspicious keywords
    const keywordsRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/suspicious_keywords`
    );
    const keywordsData = await keywordsRes.json();
    if (keywordsData.documents) {
      suspiciousKeywords = keywordsData.documents.map((doc) => doc.fields.keyword?.stringValue || '').filter(Boolean);
    }

    // Fetch phishing patterns
    const patternsRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/phishing_patterns`
    );
    const patternsData = await patternsRes.json();
    if (patternsData.documents) {
      phishingPatterns = patternsData.documents.map((doc) => doc.fields.pattern?.stringValue || '').filter(Boolean);
    }

    console.log('PhishGuard data refreshed:', {
      links: phishingLinks.length,
      emails: phishingEmails.length,
      keywords: suspiciousKeywords.length,
      patterns: phishingPatterns.length
    });

    // Update declarative net request rules
    await updateBlockRules();
  } catch (error) {
    console.error('Error fetching phishing data:', error);
  }
}

// Update declarative net request rules dynamically
async function updateBlockRules() {
  try {
    // Get existing rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    // Remove all existing rules
    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds
      });
    }

    // Create new rules from phishing links
    const newRules = phishingLinks.map((url, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: url,
        resourceTypes: ['main_frame']
      }
    }));

    // Add new rules (limit to 5000 rules for Chrome)
    if (newRules.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: newRules.slice(0, 5000)
      });
    }

    console.log(`Updated ${Math.min(newRules.length, 5000)} blocking rules`);
  } catch (error) {
    console.error('Error updating block rules:', error);
  }
}

// Analyze link with Gemini AI
async function analyzeLinkWithGemini(url) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this URL for phishing indicators and determine if it's malicious or legitimate. URL: ${url}

Please provide:
1. A verdict: PHISHING or LEGITIMATE
2. Risk level: HIGH, MEDIUM, or LOW
3. Brief explanation (2-3 sentences) of why this is suspicious or safe

Format your response as JSON:
{
  "verdict": "PHISHING" or "LEGITIMATE",
  "riskLevel": "HIGH/MEDIUM/LOW",
  "explanation": "Your explanation here"
}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      verdict: 'UNKNOWN',
      riskLevel: 'MEDIUM',
      explanation: 'Unable to analyze the URL at this time.'
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return {
      verdict: 'UNKNOWN',
      riskLevel: 'MEDIUM',
      explanation: 'Analysis service temporarily unavailable.'
    };
  }
}

// Analyze email with Gemini AI
async function analyzeEmailWithGemini(senderDomain, emailContent) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this email for phishing indicators:

Sender Domain: ${senderDomain}
Email Content: ${emailContent}

Check for:
1. Sender domain legitimacy
2. Suspicious keywords (urgent action required, verify account, etc.)
3. Common phishing patterns (fake urgency, requesting credentials, etc.)

Please provide:
1. A verdict: PHISHING or LEGITIMATE
2. Risk level: HIGH, MEDIUM, or LOW
3. Brief explanation (2-3 sentences) of why this email is suspicious or safe

Format your response as JSON:
{
  "verdict": "PHISHING" or "LEGITIMATE",
  "riskLevel": "HIGH/MEDIUM/LOW",
  "explanation": "Your explanation here",
  "suspiciousIndicators": ["indicator1", "indicator2"]
}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      verdict: 'UNKNOWN',
      riskLevel: 'MEDIUM',
      explanation: 'Unable to analyze the email at this time.',
      suspiciousIndicators: []
    };
  } catch (error) {
    console.error('Gemini email analysis error:', error);
    return {
      verdict: 'UNKNOWN',
      riskLevel: 'MEDIUM',
      explanation: 'Analysis service temporarily unavailable.',
      suspiciousIndicators: []
    };
  }
}

// Verify reported URL with Gemini before adding to blocklist
async function verifyAndAddToBlocklist(reportedUrl, description, scamType) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `A user has reported this URL as a phishing/scam site. Please verify if this is genuinely a phishing attempt.

Reported URL: ${reportedUrl}
Scam Type Reported: ${scamType}
User Description: ${description}

Analyze the URL structure, domain, and the provided context to determine:
1. Is this genuinely a phishing/scam site?
2. Should this URL be added to a blocklist?

Format your response as JSON:
{
  "isPhishing": true or false,
  "shouldBlock": true or false,
  "confidence": "HIGH/MEDIUM/LOW",
  "reason": "Explanation of your decision"
}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      
      if (result.shouldBlock && result.isPhishing) {
        // Add to Firebase blocklist
        await addToFirebaseBlocklist(reportedUrl, scamType, result.reason);
        return {
          added: true,
          ...result
        };
      }
      
      return {
        added: false,
        ...result
      };
    }
    
    return {
      added: false,
      isPhishing: false,
      shouldBlock: false,
      confidence: 'LOW',
      reason: 'Unable to verify the reported URL.'
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      added: false,
      isPhishing: false,
      shouldBlock: false,
      confidence: 'LOW',
      reason: 'Verification service temporarily unavailable.'
    };
  }
}

// Add verified phishing URL to Firebase blocklist
async function addToFirebaseBlocklist(url, scamType, reason) {
  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/phishing_links`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            url: { stringValue: url },
            scamType: { stringValue: scamType },
            reason: { stringValue: reason },
            addedAt: { timestampValue: new Date().toISOString() },
            source: { stringValue: 'gemini_verified_report' }
          }
        })
      }
    );

    if (response.ok) {
      console.log('URL added to blocklist:', url);
      // Refresh local blocklist
      await fetchPhishingData();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to Firebase:', error);
    return false;
  }
}

// Check if a URL is in the local blocklist
function isUrlBlocked(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    return phishingLinks.some(blockedUrl => {
      const cleanBlocked = blockedUrl.replace('www.', '').toLowerCase();
      return hostname.toLowerCase().includes(cleanBlocked) || 
             url.toLowerCase().includes(cleanBlocked);
    });
  } catch {
    return false;
  }
}

// Check if email sender domain is suspicious
function isEmailDomainSuspicious(domain) {
  const cleanDomain = domain.toLowerCase().replace('www.', '');
  
  return phishingEmails.some(blockedDomain => {
    const cleanBlocked = blockedDomain.toLowerCase().replace('www.', '');
    return cleanDomain.includes(cleanBlocked) || cleanBlocked.includes(cleanDomain);
  });
}

// Check for suspicious keywords in email content
function checkSuspiciousKeywords(content) {
  const lowerContent = content.toLowerCase();
  const found = [];
  
  // Default suspicious keywords if none loaded from Firebase
  const defaultKeywords = [
    'urgent action required',
    'verify your account',
    'password expired',
    'click here immediately',
    'suspend your account',
    'confirm your identity',
    'limited time offer',
    'act now',
    'free gift',
    'you have won',
    'congratulations winner',
    'claim your prize',
    'account compromised',
    'unusual activity',
    'update payment',
    'wire transfer',
    'social security',
    'bank account details'
  ];
  
  const keywords = suspiciousKeywords.length > 0 ? suspiciousKeywords : defaultKeywords;
  
  keywords.forEach(keyword => {
    if (lowerContent.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  });
  
  return found;
}

// Check for phishing patterns in email content
function checkPhishingPatterns(content) {
  const patterns = [
    /dear\s+(customer|user|member|account\s*holder)/i,
    /verify\s+your\s+(account|identity|information)/i,
    /click\s+(here|below|this\s+link)\s+to/i,
    /your\s+account\s+(has\s+been|will\s+be)\s+(suspended|locked|terminated)/i,
    /confirm\s+your\s+(password|credentials|login)/i,
    /update\s+your\s+(payment|billing|card)\s+information/i,
    /unusual\s+(activity|sign-in|login)/i,
    /immediately|urgently|within\s+24\s+hours/i
  ];
  
  const found = [];
  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      found.push(pattern.toString());
    }
  });
  
  return found;
}

// Message handler for popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkLink') {
    const isBlocked = isUrlBlocked(request.url);
    analyzeLinkWithGemini(request.url).then(analysis => {
      sendResponse({
        isBlocked,
        localMatch: isBlocked,
        geminiAnalysis: analysis
      });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'checkEmail') {
    const domainSuspicious = isEmailDomainSuspicious(request.senderDomain);
    const suspiciousKeywordsFound = checkSuspiciousKeywords(request.content);
    const patternsFound = checkPhishingPatterns(request.content);
    
    analyzeEmailWithGemini(request.senderDomain, request.content).then(analysis => {
      sendResponse({
        domainSuspicious,
        suspiciousKeywords: suspiciousKeywordsFound,
        patterns: patternsFound,
        geminiAnalysis: analysis
      });
    });
    return true;
  }
  
  if (request.action === 'verifyReport') {
    verifyAndAddToBlocklist(request.url, request.description, request.scamType).then(result => {
      sendResponse(result);
    });
    return true;
  }
  
  if (request.action === 'getStats') {
    sendResponse({
      blockedLinks: phishingLinks.length,
      blockedEmails: phishingEmails.length,
      suspiciousKeywords: suspiciousKeywords.length,
      patterns: phishingPatterns.length
    });
    return true;
  }
  
  if (request.action === 'refreshData') {
    fetchPhishingData().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'getStatus') {
    chrome.storage.local.get(['blockedCount', 'scannedCount'], function(data) {
      sendResponse({
        active: true,
        blockedCount: data.blockedCount || 0,
        scannedCount: data.scannedCount || 0,
        rulesLoaded: phishingLinks.length + phishingEmails.length
      });
    });
    return true;
  }
});

// Initial data fetch
fetchPhishingData();
