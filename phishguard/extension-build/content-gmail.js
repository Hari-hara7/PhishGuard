// PhishGuard Gmail Content Script
// Detects phishing emails directly in Gmail
// Specialized for Indian university internship scams

const SUSPICIOUS_KEYWORDS = [
  // Payment related
  'pay', 'payment', 'fee', 'processing fee', '₹', 'rupees', 'training fee',
  'training fee is applicable', 'mentor charges', 'fee scholarship',
  
  // Urgency tactics
  'urgent', 'immediately', 'asap', 'final call', 'last chance', 'final window',
  'final batch', 'limited seats', 'seats are filling', 'apply before registrations close',
  'no further extensions', 'closing soon', 'deadline alert',
  
  // Action requests
  'click here', 'click the link', 'verify now', 'confirm now', 'apply now',
  'fill out the form asap', 'complete your enrollment', 'enrollment process',
  
  // Selection claims
  'congratulations', 'you have won', 'selected', 'shortlisted',
  'shortlisted for', 'pleased to inform you', 'been shortlisted',
  
  // Document requests
  'aadhaar', 'pan card', 'bank details', 'account number',
  'send documents', 'share your', 'id proof',
  
  // Too good to be true
  'guaranteed', '100% placement', 'placement guarantee', 'lifetime job assistance',
  'stipend upto', 'stipend up to', 'free tablet', 'co-branded certificate',
  
  // Fake program names
  'job bridge program', 'digital bridge program', 'edulet tablet', 'smart edulet',
  'blu ai', 'smart labs', 'prepfree platform',
  
  // Fake organizations
  'unlox academy', 'shikshavertex', 'shiksha vertex', 'smarted innovations',
  'skill vertex', 'skillvertex',
  
  // Fake collaboration claims
  'powered by ibm', 'ibm powered', 'ibm training', 'microsoft internship',
  'in collaboration with meity', 'nasscom', 'aicte approved', 'vtu approved',
  
  // Campus scam patterns
  'campus outreach campaign', 'scholarship campaign', 'campus engagement team',
  'scholarship code', 'use code', 'avail discount',
  
  // Generic internship scam
  'certificate', 'internship opportunity', 'exclusive opportunity',
  'specially designed for', 'mandatory internship'
];

// Fake internship scam domains targeting Indian students
const SUSPICIOUS_DOMAINS = [
  // Known scam domains from user reports
  'shikshavertex.in', 'unloxacademy.com', 'smartedinnovations.com',
  'skillvertex.com', 'edusera.org', 'edulyt.in',
  
  // Fake internship sites (already blocked)
  'systemtron.in', 'codsoft.in', 'oasisinfobyte.com', 'bharatintern.live',
  'internpe.in', 'letsintern.in', 'vaultofcodes.com', 'theinternbuddy.com',
  'sparkfoundation.org', 'synapseinterns.com', 'coderscave.com',
  'intrainternship.tech', 'futureinternship.in', 'virtualintern.in',
  'youthopp.in', 'careerbuddy.online', 'trainwithcode.in',
  'prodigyinfotech.dev', 'cognifyz.com', 'infyinternshiphub.com',
  'codealpha.tech', 'mainflow.in', 'interncareerhub.com',
  'interncareerpath.tech', 'codersdata.in', 'upskillintern.in',
  'codeclause.com', 'technohacks.in', 'thecodex.in',
  
  // Generic suspicious domains
  'internmail.cc', 'careers-meta.org', 'hr-google.com', 'careerupdate.online',
  'urgent-offer.net', 'jobs-securelink.co', 'intern-portal.org', 'verify-now.info',
  'intern-checks.net', 'internship-certificate.xyz', 'internshipoffer.tech',
  'careers-ms.net', 'intern-recruiter.co', 'google-careers.online',
  'join-appleinterns.org', 'tesla-careerhub.info', 'intern-meta-program.net',
  'student-careerconnect.com', 'netflixintern-portal.com', 'linkedinterns.work'
];

// Only trust emails FROM these exact domains
const LEGITIMATE_DOMAINS = [
  'google.com', 'microsoft.com', 'amazon.com', 'apple.com', 'meta.com',
  'facebook.com', 'netflix.com', 'adobe.com', 'ibm.com', 'intel.com',
  'nvidia.com', 'oracle.com', 'sap.com', 'infosys.com', 'tcs.com',
  'wipro.com', 'accenture.com', 'deloitte.com', 'pwc.com', 'kpmg.com',
  // Indian universities - these are LEGITIMATE
  'nmamit.in', 'nitte.edu.in'
];

// Patterns that indicate scam even with personal Gmail accounts
const SCAM_PATTERNS = [
  /job\s*bridge\s*program/i,
  /digital\s*bridge\s*program/i,
  /vtu\s*approved\s*internship/i,
  /edulet\s*tablet/i,
  /unlox\s*academy/i,
  /shiksha\s*vertex/i,
  /smarted\s*innovations/i,
  /ibm\s*training\s*&\s*internship/i,
  /ibm\s*powered\s*internship/i,
  /microsoft\s*internship\s*program/i,
  /stipend\s*upto?\s*\d+k/i,
  /100%\s*placement/i,
  /scholarship\s*code:\s*\w+/i,
  /training\s*fee\s*(is|are)?\s*applicable/i,
  /mentor\s*charges\s*(are|is)?\s*applicable/i,
  /collaboration\s*with\s*(meity|nasscom)/i,
  /powered\s*by\s*(ibm|microsoft|google)/i,
  /final\s*call\s*[–-]\s*limited\s*seats/i,
  /complete\s*(your|the)\s*enrollment\s*(process)?/i,
  /all\s*shortlisted\s*students/i,
  /campus\s*(outreach|engagement)\s*(campaign|team)/i
];

let lastAnalyzedEmail = null;
let warningBanner = null;

function analyzeEmailContent() {
  console.log('🛡️ PhishGuard: Analyzing email...');
  
  // Get email content - try multiple selectors
  const emailBody = document.querySelector('.a3s.aiL') ||
                    document.querySelector('[data-message-id]') ||
                    document.querySelector('.ii.gt') ||
                    document.querySelector('[role="listitem"]') ||
                    document.querySelector('[role="main"]');
  
  if (!emailBody) {
    console.log('🛡️ PhishGuard: No email body found');
    return;
  }

  const emailText = emailBody.innerText.toLowerCase();
  const emailTextOriginal = emailBody.innerText; // Keep original for regex
  const emailHTML = emailBody.innerHTML;

  console.log('🛡️ PhishGuard: Email text length:', emailText.length);

  // Check if already analyzed this email
  const emailId = document.location.href;
  if (lastAnalyzedEmail === emailId) {
    console.log('🛡️ PhishGuard: Already analyzed this email');
    return;
  }
  lastAnalyzedEmail = emailId;

  // Get sender info - try multiple selectors for Gmail
  let senderEmail = '';
  let senderDomain = '';
  
  // Try multiple ways to get sender email
  const senderSelectors = [
    'span[email]',
    '.gD[email]',
    '.go[email]',
    '[data-hovercard-id*="@"]',
    '.g2',
    '.gD'
  ];
  
  for (const selector of senderSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      senderEmail = element.getAttribute('email') || 
                    element.getAttribute('data-hovercard-id') ||
                    element.innerText || '';
      if (senderEmail.includes('@')) {
        senderDomain = senderEmail.split('@')[1] || '';
        break;
      }
    }
  }

  // Also try to extract email from header text
  if (!senderEmail) {
    const headerArea = document.querySelector('.ha') || document.querySelector('.gE.iv.gt');
    if (headerArea) {
      const emailMatch = headerArea.innerText.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        senderEmail = emailMatch[0];
        senderDomain = senderEmail.split('@')[1];
      }
    }
  }

  console.log('🛡️ PhishGuard: Sender:', senderEmail, 'Domain:', senderDomain);

  // Analyze for phishing indicators
  const analysis = {
    suspiciousKeywords: [],
    matchedScamPatterns: [],
    isSuspiciousDomain: false,
    isPersonalGmailScam: false,
    isLegitimate: false,
    riskScore: 0,
    reasons: []
  };

  // Check keywords
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (emailText.includes(keyword.toLowerCase())) {
      analysis.suspiciousKeywords.push(keyword);
      analysis.riskScore += 8;
    }
  });

  // Check scam patterns (regex) - HIGH PRIORITY
  SCAM_PATTERNS.forEach(pattern => {
    if (pattern.test(emailTextOriginal)) {
      analysis.matchedScamPatterns.push(pattern.source);
      analysis.riskScore += 25; // High score for known scam patterns
    }
  });

  // Check for personal Gmail sending corporate-style internship emails
  if (senderDomain === 'gmail.com' && 
      (emailText.includes('internship') || emailText.includes('shortlisted') || 
       emailText.includes('enrollment') || emailText.includes('program'))) {
    analysis.isPersonalGmailScam = true;
    analysis.riskScore += 35;
    analysis.reasons.push('Personal Gmail sending internship offers (common scam pattern)');
  }

  // Check sender domain
  if (senderDomain) {
    if (SUSPICIOUS_DOMAINS.some(d => senderDomain.includes(d))) {
      analysis.isSuspiciousDomain = true;
      analysis.riskScore += 50;
      analysis.reasons.push(`Known scam domain: ${senderDomain}`);
    }
    
    // Check for shikshavertex pattern (name_name@shikshavertex.in)
    if (senderDomain.includes('shikshavertex') || senderDomain.includes('skillvertex')) {
      analysis.riskScore += 60;
      analysis.reasons.push('ShikshaVertex/SkillVertex scam domain detected');
    }
    
    if (LEGITIMATE_DOMAINS.some(d => senderDomain.endsWith(d))) {
      analysis.isLegitimate = true;
      analysis.riskScore = Math.max(0, analysis.riskScore - 30);
    }
  }

  // Check for payment requests with internship context
  if ((emailText.includes('fee') || emailText.includes('payment') || emailText.includes('charges')) && 
      (emailText.includes('internship') || emailText.includes('training') || emailText.includes('program'))) {
    analysis.riskScore += 45;
    analysis.reasons.push('Requires payment for internship (legitimate internships are FREE)');
  }

  // Check for urgency tactics
  if (emailText.includes('urgent') || emailText.includes('immediately') || 
      emailText.includes('final call') || emailText.includes('final batch') ||
      emailText.includes('limited seats') || emailText.includes('last chance')) {
    analysis.riskScore += 25;
    analysis.reasons.push('Uses aggressive urgency tactics');
  }

  // Check for document requests
  if (emailText.includes('aadhaar') || emailText.includes('pan card') || emailText.includes('id proof')) {
    analysis.riskScore += 30;
    analysis.reasons.push('Requests sensitive documents');
  }

  // Check for fake collaboration claims
  if ((emailText.includes('meity') || emailText.includes('nasscom') || emailText.includes('aicte')) &&
      (emailText.includes('internship') || emailText.includes('training'))) {
    analysis.riskScore += 30;
    analysis.reasons.push('Claims fake govt/industry collaboration');
  }

  // Check for scholarship code pattern (scam indicator)
  if (/scholarship\s*code/i.test(emailTextOriginal) || /use\s*code:\s*\w+/i.test(emailTextOriginal)) {
    analysis.riskScore += 35;
    analysis.reasons.push('Contains "scholarship code" (common scam tactic)');
  }

  // Check for "100% placement" or "guaranteed" claims
  if (emailText.includes('100% placement') || emailText.includes('placement guarantee')) {
    analysis.riskScore += 40;
    analysis.reasons.push('Claims 100% placement guarantee (unrealistic)');
  }

  // Check for free tablet / device promises
  if (emailText.includes('tablet') && (emailText.includes('free') || emailText.includes('receive'))) {
    analysis.riskScore += 30;
    analysis.reasons.push('Promises free device (bait tactic)');
  }

  // Check for mass BCC pattern (to bcc: me)
  const emailHeader = document.querySelector('.iw') || document.querySelector('.gE');
  if (emailHeader && emailHeader.innerText.toLowerCase().includes('bcc:')) {
    analysis.riskScore += 15;
    analysis.reasons.push('Sent as BCC (mass email)');
  }

  // Add scam pattern reasons
  if (analysis.matchedScamPatterns.length > 0) {
    analysis.reasons.push(`Matches ${analysis.matchedScamPatterns.length} known scam patterns`);
  }

  // Add keyword reasons
  if (analysis.suspiciousKeywords.length > 5) {
    analysis.reasons.push(`Contains ${analysis.suspiciousKeywords.length} suspicious keywords`);
  }

  // Cap risk score at 100
  analysis.riskScore = Math.min(analysis.riskScore, 100);

  // Show warning if suspicious (lowered threshold for better detection)
  if (analysis.riskScore >= 25) {
    showPhishingWarning(analysis, senderEmail);
  } else {
    removeWarningBanner();
  }
}

function showPhishingWarning(analysis, senderEmail) {
  // Remove existing banner
  removeWarningBanner();

  // Determine scam type
  let scamType = 'Potential Phishing Email';
  if (analysis.reasons.some(r => r.includes('internship') || r.includes('ShikshaVertex') || r.includes('scam pattern'))) {
    scamType = 'FAKE INTERNSHIP SCAM';
  } else if (analysis.reasons.some(r => r.includes('payment'))) {
    scamType = 'Payment Scam';
  }

  // Determine severity color
  let gradientColor = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
  let borderColor = '#ff6666';
  if (analysis.riskScore >= 70) {
    gradientColor = 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)';
    borderColor = '#ff0000';
  }

  // Create warning banner
  warningBanner = document.createElement('div');
  warningBanner.id = 'phishguard-warning';
  warningBanner.innerHTML = `
    <div style="
      background: ${gradientColor};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      margin: 10px 0;
      font-family: 'Google Sans', Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4);
      border: 3px solid ${borderColor};
      animation: pulse 2s infinite;
    ">
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4); }
          50% { box-shadow: 0 4px 35px rgba(255, 0, 0, 0.7); }
        }
      </style>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="
          background: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <span style="font-size: 28px;">🚨</span>
        </div>
        <div style="flex: 1;">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">
            🛡️ PhishGuard Alert: ${scamType} Detected!
          </div>
          <div style="font-size: 14px; opacity: 0.95; margin-bottom: 6px;">
            <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px;">
              Risk Score: <strong>${analysis.riskScore}%</strong>
            </span>
          </div>
          <div style="font-size: 13px; opacity: 0.9;">
            ${analysis.reasons.slice(0, 3).map(r => `• ${r}`).join('<br>')}
          </div>
          ${senderEmail ? `<div style="font-size: 12px; opacity: 0.8; margin-top: 6px;">📧 From: ${senderEmail}</div>` : ''}
        </div>
        <button id="phishguard-dismiss-btn" style="
          background: rgba(255,255,255,0.25);
          border: 1px solid rgba(255,255,255,0.5);
          color: white;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: bold;
        ">✕ Dismiss</button>
      </div>
      <div style="
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid rgba(255,255,255,0.4);
        font-size: 13px;
        background: rgba(0,0,0,0.15);
        padding: 12px;
        border-radius: 8px;
        margin-top: 12px;
      ">
        <strong>⚠️ IMPORTANT:</strong><br>
        • <strong>Legitimate internships do NOT charge fees</strong><br>
        • Do NOT fill out the Google Form link<br>
        • Verify directly with your college placement cell<br>
        • Real companies (IBM, Microsoft) never email from Gmail or random domains
      </div>
    </div>
  `;

  // Insert banner before email content - try multiple containers
  const containerSelectors = [
    '.a3s.aiL',
    '.ii.gt',
    '[data-message-id]',
    '.gs',
    '.adn.ads',
    '[role="listitem"]'
  ];
  
  let emailContainer = null;
  for (const selector of containerSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      emailContainer = el.parentElement || el;
      break;
    }
  }
  
  if (emailContainer) {
    emailContainer.insertBefore(warningBanner, emailContainer.firstChild);
    console.log('🛡️ PhishGuard: Banner inserted successfully');
    
    // Add dismiss button event listener (avoids inline onclick CSP issues)
    const dismissBtn = document.getElementById('phishguard-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function() {
        removeWarningBanner();
      });
    }
  } else {
    // Fallback: insert at top of main area
    const mainArea = document.querySelector('[role="main"]');
    if (mainArea) {
      mainArea.insertBefore(warningBanner, mainArea.firstChild);
      console.log('🛡️ PhishGuard: Banner inserted in main area (fallback)');
    }
  }

  console.log('🛡️ PhishGuard: Phishing email detected!', analysis);
}

function removeWarningBanner() {
  const existing = document.getElementById('phishguard-warning');
  if (existing) {
    existing.remove();
  }
  warningBanner = null;
}

// Observe DOM changes for email navigation
function setupObserver() {
  let lastUrl = location.href;
  
  const observer = new MutationObserver((mutations) => {
    // Check if URL changed or content changed significantly
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      lastAnalyzedEmail = null;
      setTimeout(analyzeEmailContent, 800);
    }
    
    // Also check if email content appeared
    const emailBody = document.querySelector('.a3s.aiL');
    if (emailBody && !document.getElementById('phishguard-warning')) {
      setTimeout(analyzeEmailContent, 300);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize
console.log('🛡️ PhishGuard: Gmail protection active - v2.2');

// Multiple checks on load
setTimeout(analyzeEmailContent, 1000);
setTimeout(analyzeEmailContent, 2000);
setTimeout(analyzeEmailContent, 3000);

// Setup observer for navigation
setupObserver();

// Also check on hash change
window.addEventListener('hashchange', () => {
  console.log('🛡️ PhishGuard: Hash changed, re-analyzing...');
  lastAnalyzedEmail = null;
  setTimeout(analyzeEmailContent, 500);
  setTimeout(analyzeEmailContent, 1500);
  setTimeout(addScanButton, 1000);
});

// Periodic check every 2 seconds for first 10 seconds
let checkCount = 0;
const periodicCheck = setInterval(() => {
  checkCount++;
  if (checkCount > 5) {
    clearInterval(periodicCheck);
    return;
  }
  if (!document.getElementById('phishguard-warning')) {
    analyzeEmailContent();
  }
  addScanButton();
}, 2000);

// ========== SCAN WITH PHISHGUARD BUTTON ==========

function addScanButton() {
  // Don't add if already exists
  if (document.getElementById('phishguard-scan-btn')) return;
  
  // Find the email toolbar (action buttons area)
  const toolbar = document.querySelector('.ade') || 
                  document.querySelector('[gh="mtb"]') ||
                  document.querySelector('.G-atb');
  
  if (!toolbar) return;
  
  // Create scan button
  const scanBtn = document.createElement('div');
  scanBtn.id = 'phishguard-scan-btn';
  scanBtn.innerHTML = `
    <div style="
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      margin-left: 8px;
      background: linear-gradient(135deg, #0891b2 0%, #2563eb 100%);
      color: white;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(8, 145, 178, 0.3);
      transition: all 0.2s;
      font-family: 'Google Sans', Roboto, sans-serif;
    " onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(8, 145, 178, 0.4)'"
       onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(8, 145, 178, 0.3)'">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
      Scan with PhishGuard
    </div>
  `;
  
  toolbar.appendChild(scanBtn);
  
  // Add click handler
  scanBtn.addEventListener('click', scanWithPhishGuard);
  
  console.log('🛡️ PhishGuard: Scan button added');
}

function scanWithPhishGuard() {
  // Extract email data
  const emailData = extractEmailData();
  
  if (!emailData.body) {
    alert('Please open an email first to scan it with PhishGuard');
    return;
  }
  
  // Encode data for URL
  const params = new URLSearchParams({
    sender: emailData.sender,
    subject: emailData.subject,
    body: emailData.body,
    autoScan: 'true'
  });
  
  // Open PhishGuard Email Scanner with data
  const scannerUrl = `http://localhost:3000/email?${params.toString()}`;
  window.open(scannerUrl, '_blank');
  
  console.log('🛡️ PhishGuard: Opening scanner with email data');
}

function extractEmailData() {
  const data = {
    sender: '',
    subject: '',
    body: ''
  };
  
  // Get sender
  const senderSelectors = ['span[email]', '.gD[email]', '.go[email]', '.g2'];
  for (const selector of senderSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      data.sender = el.getAttribute('email') || el.innerText || '';
      if (data.sender.includes('@')) break;
    }
  }
  
  // Get subject
  const subjectEl = document.querySelector('h2.hP') || 
                    document.querySelector('[data-thread-perm-id]') ||
                    document.querySelector('.ha h2');
  if (subjectEl) {
    data.subject = subjectEl.innerText || '';
  }
  
  // Get body
  const bodyEl = document.querySelector('.a3s.aiL') || 
                 document.querySelector('.ii.gt') ||
                 document.querySelector('[data-message-id]');
  if (bodyEl) {
    data.body = bodyEl.innerText || '';
  }
  
  return data;
}

// Add scan button on load
setTimeout(addScanButton, 2000);
setTimeout(addScanButton, 4000);

