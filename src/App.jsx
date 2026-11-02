import { useEffect, useState } from "react";
import {
  getCategories,
  getDistricts,
  sendOTP,
  verifyOTP,
  submitSubmission,
} from "./services/api";

const C = {
  navy: "#102957",
  blue: "#10509a",
  teal: "#078c89",
  pale: "#f3f9ff",
  border: "#e2e8f0",
  muted: "#64748b",
  green: "#047857",
};

function App() {
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryData, districtData] = await Promise.all([
          getCategories(),
          getDistricts(),
        ]);
        setCategories(categoryData);
        setDistricts(districtData);
      } catch (error) {
        console.error("Data loading error:", error);
      }
    }
    loadData();
  }, []);

  const constituencies = districts.filter((item) => item.districtId === district);
  const subcategories = categories.filter((item) => item.categoryId === category);

  const text = {
    en: {
      title: "Civic Priorities",
      subtitle: "Your voice matters. Help us understand your community's needs.",
      mobile: "Mobile Number",
      district: "District",
      constituency: "Assembly Constituency",
      category: "Category",
      subcategory: "Subcategory",
      description: "Describe Your Issue",
      select: "Select",
      placeholder: "Enter your 10-digit mobile number",
      descriptionPlaceholder: "Explain the issue in detail...",
    },
    pa: {
      title: "ਨਾਗਰਿਕ ਤਰਜੀਹਾਂ",
      subtitle: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਮਹੱਤਵਪੂਰਨ ਹੈ। ਆਪਣੇ ਇਲਾਕੇ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਸਾਂਝੀਆਂ ਕਰੋ।",
      mobile: "ਮੋਬਾਈਲ ਨੰਬਰ",
      district: "ਜ਼ਿਲ੍ਹਾ",
      constituency: "ਵਿਧਾਨ ਸਭਾ ਹਲਕਾ",
      category: "ਸ਼੍ਰੇਣੀ",
      subcategory: "ਉਪ-ਸ਼੍ਰੇਣੀ",
      description: "ਆਪਣੀ ਸਮੱਸਿਆ ਬਾਰੇ ਦੱਸੋ",
      select: "ਚੁਣੋ",
      placeholder: "10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
      descriptionPlaceholder: "ਆਪਣੀ ਸਮੱਸਿਆ ਬਾਰੇ ਵਿਸਥਾਰ ਨਾਲ ਦੱਸੋ...",
    },
  };
  const t = text[language];

  async function handleSendOTP() {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setOtpMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      setOtpLoading(true);
      setOtpMessage("");
      await sendOTP(mobile);
      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      setOtpMessage("OTP sent successfully on WhatsApp.");
    } catch (error) {
      setOtpMessage(error.message);
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (!/^\d{6}$/.test(otp)) {
      setOtpMessage("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      setOtpLoading(true);
      setOtpMessage("");
      await verifyOTP(mobile, otp);
      setOtpVerified(true);
      setOtpMessage("Mobile number verified successfully.");
    } catch (error) {
      setOtpMessage(error.message);
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleContinue(e) {
    e.preventDefault();
    if (!otpVerified) {
      setSubmissionMessage("Please verify your mobile number first.");
      return;
    }
    if (!district || !constituency || !category || !subcategory || !description.trim()) {
      setSubmissionMessage("Please complete all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmissionMessage("");
      const result = await submitSubmission({
        mobile, district, constituency, category, subcategory,
        description: description.trim(), language,
      });
      setSubmissionMessage(
        "Your response has been submitted successfully! Reference ID: " + result.submissionId
      );
    } catch (error) {
      setSubmissionMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const styles = {
    page: { minHeight: "100vh", overflow: "hidden", background: C.pale, color: C.navy, fontFamily: "Arial, sans-serif" },
    header: { position: "relative", zIndex: 20, borderBottom: "1px solid #f1f5f9", background: "rgba(255,255,255,.96)" },
    headerInner: { maxWidth: 1500, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 24px" },
    logo: { color: C.navy, fontSize: 27, fontWeight: 900, letterSpacing: "-1px", textDecoration: "none" },
    logoLine: { marginTop: 4, height: 4, width: 64, borderRadius: 20, background: "linear-gradient(90deg,#1e40af,#14b8a6)" },
    nav: { display: "flex", alignItems: "center", gap: 32, fontSize: 14, fontWeight: 700 },
    navLink: { color: "#172b50", textDecoration: "none" },
    languageWrap: { display: "flex", alignItems: "center", gap: 12 },
    languageBox: { display: "flex", alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 12, background: "white", padding: 4, boxShadow: "0 1px 3px #0000000d" },
    langButton: (active) => ({ border: 0, borderRadius: 8, padding: "9px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", background: active ? "#ccfbf1" : "transparent", color: active ? "#115e59" : "#475569" }),
    signIn: { border: `1px solid ${C.navy}`, borderRadius: 12, padding: "10px 20px", color: C.navy, background: "white", fontWeight: 700, cursor: "pointer" },
    hero: { position: "relative", overflow: "hidden", background: "linear-gradient(100deg,#fff 0%,#f2faff 55%,#dff3f7 100%)" },
    heroInner: { position: "relative", maxWidth: 1500, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 20, padding: "58px 24px 68px" },
    heroContent: { position: "relative", zIndex: 2 },
    pill: { display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #ccfbf1", borderRadius: 30, background: "#f0fdfa", padding: "9px 16px", color: "#0f766e", fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" },
    dot: { height: 8, width: 8, borderRadius: "50%", background: "#14b8a6" },
    h1: { maxWidth: 680, margin: "22px 0 0", color: C.navy, fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.12, letterSpacing: -1.5, fontWeight: 900 },
    teal: { color: "#0d9488" },
    lead: { maxWidth: 560, margin: "20px 0 0", color: "#64748b", fontSize: 19, lineHeight: 1.7 },
    primaryButton: { display: "inline-flex", alignItems: "center", gap: 16, marginTop: 28, border: 0, borderRadius: 40, background: C.teal, color: "white", padding: "15px 30px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px #99f6e4" },
    illustration: { position: "relative", display: "flex", minHeight: 340, alignItems: "center", justifyContent: "center" },
    buildings: { position: "relative", display: "flex", width: "100%", maxWidth: 530, height: 270, alignItems: "flex-end", justifyContent: "center" },
    building: (height, color, side) => ({ position: "absolute", bottom: 0, [side]: 8, height, width: 104, border: "1px solid #dbeafe", borderRadius: "16px 16px 0 0", background: color, boxShadow: "0 2px 5px #0000000d", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 12, alignContent: "start" }),
    window: { height: 23, borderRadius: 3, background: "rgba(255,255,255,.9)" },
    people: { position: "relative", zIndex: 2, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, marginBottom: 8 },
    person: { display: "flex", flexDirection: "column", alignItems: "center" },
    face: (size, bg) => ({ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "4px solid white", background: bg, fontSize: size * .57, boxShadow: "0 3px 8px #00000020" }),
    body: (width, height, bg) => ({ width, height, marginTop: 4, borderRadius: "36px 36px 0 0", background: bg, boxShadow: "0 3px 8px #00000020" }),
    floatTag: { position: "absolute", zIndex: 3, border: "1px solid white", borderRadius: 12, background: "rgba(255,255,255,.92)", padding: "11px 14px", boxShadow: "0 5px 15px #00000018", fontSize: 13, fontWeight: 800 },
    main: { position: "relative", maxWidth: 1350, margin: "-20px auto 0", padding: "0 20px 48px" },
    card: { overflow: "hidden", border: "1px solid white", borderRadius: 24, background: "white", boxShadow: "0 15px 55px rgba(38,89,150,.12)" },
    cardInner: { padding: 32 },
    progress: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22, marginBottom: 28 },
    progressItem: { display: "flex", alignItems: "center", gap: 12 },
    number: (active, done = false) => ({ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: done ? "#d1fae5" : active ? C.blue : "#e2e8f0", color: done ? "#047857" : active ? "white" : "#64748b", fontSize: 18, fontWeight: 800 }),
    progressTitle: { margin: 0, color: C.navy, fontSize: 15, fontWeight: 800 },
    smallMuted: { margin: "4px 0 0", color: "#64748b", fontSize: 12 },
    progressLine: { flex: 1, height: 1, minWidth: 30, background: "#e2e8f0" },
    stepBadge: (done) => ({ marginLeft: "auto", borderRadius: 30, padding: "9px 15px", background: done ? "#d1fae5" : "#eff6ff", color: done ? "#047857" : "#1d4ed8", fontSize: 12, fontWeight: 800 }),
    otpPanel: { border: "1px solid #bfdbfe", borderRadius: 18, background: "linear-gradient(135deg,#eef7ff,#e8f3fc)", padding: 26 },
    otpGrid: { display: "grid", gridTemplateColumns: "minmax(220px,1.1fr) minmax(0,2fr)", alignItems: "center", gap: 20 },
    mobileHeading: { display: "flex", alignItems: "center", gap: 16 },
    phoneIcon: { width: 64, height: 64, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#dbeafe", fontSize: 30 },
    mobileTitle: { margin: 0, borderLeft: "2px solid #93c5fd", paddingLeft: 16, color: C.navy, fontSize: 18, fontWeight: 900 },
    mobileSub: { margin: "5px 0 0", paddingLeft: 18, color: "#64748b", fontSize: 13 },
    inputRow: { display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12 },
    phoneInputWrap: { position: "relative" },
    prefix: { position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", borderRight: "1px solid #cbd5e1", paddingRight: 12, color: C.navy, fontWeight: 800 },
    input: { boxSizing: "border-box", width: "100%", minWidth: 0, border: "1px solid #e2e8f0", borderRadius: 12, background: "white", padding: "14px 16px", color: "#1e293b", fontSize: 15, outline: "none" },
    actionButton: (bg) => ({ minWidth: 170, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, border: 0, borderRadius: 12, background: bg, color: "white", padding: "14px 22px", fontWeight: 800, cursor: "pointer", boxShadow: "0 3px 8px #00000015" }),
    otpEntry: { display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "end", gap: 16, marginTop: 24, borderTop: "1px solid #bfdbfe", paddingTop: 20 },
    label: { display: "block", marginBottom: 8, color: C.navy, fontSize: 14, fontWeight: 800 },
    message: (success) => ({ marginTop: 18, border: `1px solid ${success ? "#a7f3d0" : "#bfdbfe"}`, borderRadius: 12, background: success ? "#ecfdf5" : "#eff6ff", color: success ? "#065f46" : "#1e40af", padding: 13, fontSize: 14, fontWeight: 700 }),
    verified: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18, border: "1px solid #a7f3d0", borderRadius: 12, background: "#ecfdf5", color: "#047857", padding: 13, textAlign: "center", fontSize: 14, fontWeight: 800 },
    sectionHeading: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
    sectionNumber: { width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: C.blue, color: "white", fontSize: 18, fontWeight: 800 },
    fieldGrid: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "20px 24px" },
    field: { minWidth: 0 },
    iconInput: { position: "relative" },
    fieldIcon: { position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none" },
    select: { appearance: "none", paddingLeft: 44, paddingRight: 38 },
    arrow: { position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" },
    textarea: { resize: "vertical", paddingLeft: 44, minHeight: 92 },
    submit: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 28, border: 0, borderRadius: 40, background: C.blue, color: "white", padding: "16px 24px", fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px #bfdbfe" },
    footer: { background: "linear-gradient(to bottom,#f3f9ff,#fff)", padding: "10px 20px 32px" },
    footerInner: { maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, color: "#25436e", textAlign: "center", fontSize: 14 },
    footerLine: { flex: 1, height: 1, background: "#cbd5e1" },
  };

  const disabledButton = { opacity: 0.5, cursor: "not-allowed" };
  const fieldInputStyle = { ...styles.input };
  const selectStyle = { ...styles.input, ...styles.select };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        button, input, select, textarea { font: inherit; }
        button { transition: background .2s ease, transform .2s ease, opacity .2s ease; }
        button:not(:disabled):hover { filter: brightness(.94); }
        a:hover { color: #0d9488 !important; }
        input:focus, select:focus, textarea:focus { border-color: #14b8a6 !important; box-shadow: 0 0 0 4px #ccfbf1; }
        input:disabled, select:disabled { background: #f1f5f9; cursor: not-allowed; }
        .civic-nav { display:flex; }
        .civic-progress-line { display:block; }
        .civic-hero-grid { grid-template-columns:1fr 1fr; }
        .civic-fields { grid-template-columns:repeat(3,minmax(0,1fr)); }
        .civic-desc { grid-column:span 2; }
        @media (max-width: 900px) {
          .civic-nav { display:none; }
          .civic-hero-grid { grid-template-columns:1fr; }
          .civic-illustration { min-height:280px !important; }
          .civic-fields { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 620px) {
          .civic-header-inner { padding:14px 16px !important; }
          .civic-logo { font-size:21px !important; }
          .civic-hero-inner { padding:42px 18px 48px !important; }
          .civic-main { padding:0 12px 32px !important; }
          .civic-card-inner { padding:18px !important; }
          .civic-otp-panel { padding:17px !important; }
          .civic-otp-grid, .civic-input-row, .civic-otp-entry { grid-template-columns:1fr !important; }
          .civic-fields { grid-template-columns:1fr; }
          .civic-desc { grid-column:span 1; }
          .civic-action { width:100%; min-width:0 !important; }
          .civic-step-badge { margin-left:0 !important; }
          .civic-progress-line { display:none; }
          .civic-illustration { min-height:250px !important; }
          .civic-people { gap:7px !important; transform:scale(.88); }
          .civic-footer-line { display:none; }
          .civic-footer-inner { flex-direction:column; }
        }
      `}</style>

      {/* NAVBAR */}
      <header style={styles.header}>
        <div className="civic-header-inner" style={styles.headerInner}>
          <a href="#" className="civic-logo" style={styles.logo}>
            CIVIC <span style={styles.teal}>PRIORITIES</span>
            <div style={styles.logoLine} />
          </a>
          <nav className="civic-nav" style={styles.nav}>
            <a href="#how-it-works" style={styles.navLink}>How it works</a>
            <a href="#explore-priorities" style={styles.navLink}>Explore priorities</a>
            <a href="#about" style={styles.navLink}>About</a>
          </nav>
          <div style={styles.languageWrap}>
            <div style={styles.languageBox}>
              <button type="button" onClick={() => setLanguage("pa")} style={styles.langButton(language === "pa")}>ਪੰਜਾਬੀ</button>
              <button type="button" onClick={() => setLanguage("pa")} style={styles.langButton(false)}>हिंदी</button>
              <button type="button" onClick={() => setLanguage("en")} style={styles.langButton(language === "en")}>English</button>
            </div>
            <div style={{ height: 30, width: 1, background: "#cbd5e1" }} />
            <button type="button" style={styles.signIn}>Sign in</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div className="civic-hero-grid civic-hero-inner" style={styles.heroInner}>
          <div style={styles.heroContent}>
            <span style={styles.pill}><span style={styles.dot} />Your community. Your priorities.</span>
            <h1 style={styles.h1}>A better manifesto starts with <span style={styles.teal}>your priorities.</span></h1>
            <p style={styles.lead}>Tell us what needs attention in your neighbourhood.</p>
            <button type="button" onClick={() => document.getElementById("submission-form")?.scrollIntoView({ behavior: "smooth" })} style={styles.primaryButton}>
              Share a local issue <span style={{ fontSize: 22 }}>→</span>
            </button>
          </div>

          <div className="civic-illustration" style={styles.illustration}>
            <div style={styles.buildings}>
              <div style={styles.building(160, "#dcecf1", "left")}>
                {Array.from({ length: 6 }).map((_, i) => <div key={i} style={styles.window} />)}
              </div>
              <div style={styles.building(192, "#c9e5e0", "right")}>
                {Array.from({ length: 8 }).map((_, i) => <div key={i} style={styles.window} />)}
              </div>
              <div className="civic-people" style={styles.people}>
                <div style={styles.person}><div style={styles.face(64, "#eab89a")}>👩🏻</div><div style={styles.body(80, 96, "#0d9488")} /></div>
                <div style={styles.person}><div style={styles.face(78, "#d9a17f")}>👳🏻‍♂️</div><div style={styles.body(96, 128, "#163e79")} /></div>
                <div style={styles.person}><div style={styles.face(64, "#b87955")}>👨🏻</div><div style={styles.body(80, 96, "#047857")} /></div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, borderRadius: 20, background: "#99f6e4" }} />
              <div style={{ ...styles.floatTag, left: 5, top: 12, color: "#0f766e" }}>🏡 Better communities</div>
              <div style={{ ...styles.floatTag, right: 0, top: 52, color: "#1e40af" }}>🤝 Your voice matters</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FORM */}
      <main id="submission-form" className="civic-main" style={styles.main}>
        <div style={styles.card}>
          <div className="civic-card-inner" style={styles.cardInner}>
            <div style={styles.progress}>
              <div style={styles.progressItem}>
                <div style={styles.number(!otpVerified, otpVerified)}>{otpVerified ? "✓" : "1"}</div>
                <div><h3 style={styles.progressTitle}>Mobile Verification</h3><p style={styles.smallMuted}>Verify your WhatsApp number to continue</p></div>
              </div>
              <div className="civic-progress-line" style={styles.progressLine} />
              <div style={styles.progressItem}>
                <div style={styles.number(otpVerified)}>{2}</div>
                <div><h3 style={styles.progressTitle}>Submission Details</h3><p style={styles.smallMuted}>Share your community's priorities</p></div>
              </div>
              <span className="civic-step-badge" style={styles.stepBadge(otpVerified)}>{otpVerified ? "Step 2 of 2" : "Step 1 of 2"}</span>
            </div>

            <form onSubmit={handleContinue}>
              <div className="civic-otp-panel" style={styles.otpPanel}>
                <div className="civic-otp-grid" style={styles.otpGrid}>
                  <div style={styles.mobileHeading}>
                    <div style={styles.phoneIcon}>📱</div>
                    <div>
                      <label style={styles.mobileTitle}>{t.mobile}</label>
                      <p style={styles.mobileSub}>Enter your 10-digit mobile number</p>
                    </div>
                  </div>
                  <div className="civic-input-row" style={styles.inputRow}>
                    <div style={styles.phoneInputWrap}>
                      <span style={styles.prefix}>+91</span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setMobile(value);
                          setOtpSent(false); setOtpVerified(false); setOtp("");
                          setOtpMessage(""); setDistrict(""); setConstituency("");
                          setCategory(""); setSubcategory(""); setDescription("");
                          setSubmissionMessage("");
                        }}
                        placeholder={t.placeholder}
                        maxLength={10}
                        disabled={otpVerified || otpLoading}
                        required
                        style={{ ...fieldInputStyle, height: 52, paddingLeft: 78 }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || otpVerified || !/^[6-9]\d{9}$/.test(mobile)}
                      className="civic-action"
                      style={{ ...styles.actionButton(C.blue), ...(otpLoading || otpVerified || !/^[6-9]\d{9}$/.test(mobile) ? disabledButton : {}) }}
                    >
                      <span>➤</span>{otpLoading ? "Please wait..." : otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div className="civic-otp-entry" style={styles.otpEntry}>
                    <div>
                      <label style={styles.label}>Enter 6-Digit OTP</label>
                      <input
                        type="text" inputMode="numeric" maxLength={6} value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter OTP received on WhatsApp"
                        style={{ ...fieldInputStyle, letterSpacing: 5 }}
                      />
                    </div>
                    <button type="button" onClick={handleVerifyOTP} disabled={otpLoading || otp.length !== 6} className="civic-action"
                      style={{ ...styles.actionButton("#0d9488"), ...(otpLoading || otp.length !== 6 ? disabledButton : {}) }}>
                      <span>✓</span>{otpLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                )}

                {otpMessage && <div style={styles.message(otpVerified)}>{otpVerified ? "✓ " : "ℹ "}{otpMessage}</div>}
                {otpVerified && <div style={styles.verified}><span style={{ fontSize: 18 }}>✓</span>Mobile number verified successfully. You can now fill the form.</div>}
              </div>

              {otpVerified && (
                <div style={{ marginTop: 30 }}>
                  <div style={styles.sectionHeading}>
                    <div style={styles.sectionNumber}>2</div>
                    <div><h2 style={{ ...styles.progressTitle, fontSize: 18 }}>Submission Details</h2><p style={{ ...styles.smallMuted, fontSize: 13 }}>Share your community's priorities</p></div>
                    <div className="civic-progress-line" style={styles.progressLine} />
                  </div>

                  <div className="civic-fields" style={styles.fieldGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>{t.district}</label>
                      <div style={styles.iconInput}>
                        <span style={styles.fieldIcon}>📍</span>
                        <select value={district} onChange={(e) => { setDistrict(e.target.value); setConstituency(""); }} required style={selectStyle}>
                          <option value="">{t.select} {t.district}</option>
                          {districts.map((item) => <option key={item.districtId} value={item.districtId}>{language === "pa" ? item.districtPa : item.districtEn}</option>)}
                        </select>
                        <span style={styles.arrow}>▼</span>
                      </div>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>{t.constituency}</label>
                      <div style={styles.iconInput}>
                        <span style={styles.fieldIcon}>🏛️</span>
                        <select value={constituency} onChange={(e) => setConstituency(e.target.value)} required disabled={!district} style={selectStyle}>
                          <option value="">{t.select} {t.constituency}</option>
                          {constituencies.map((item) => <option key={item.constituencyId} value={item.constituencyId}>{language === "pa" ? item.constituencyPa : item.constituencyEn}</option>)}
                        </select>
                        <span style={styles.arrow}>▼</span>
                      </div>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>{t.category}</label>
                      <div style={styles.iconInput}>
                        <span style={styles.fieldIcon}>▦</span>
                        <select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }} required style={selectStyle}>
                          <option value="">{t.select} {t.category}</option>
                          {categories.map((item) => <option key={item.categoryId} value={item.categoryId}>{language === "pa" ? item.categoryPa : item.categoryEn}</option>)}
                        </select>
                        <span style={styles.arrow}>▼</span>
                      </div>
                    </div>

                    <div style={styles.field}>
                      <label style={styles.label}>{t.subcategory}</label>
                      <div style={styles.iconInput}>
                        <span style={styles.fieldIcon}>☷</span>
                        <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required disabled={!category} style={selectStyle}>
                          <option value="">{t.select} {t.subcategory}</option>
                          {subcategories.map((item) => <option key={item.subcategoryId} value={item.subcategoryId}>{language === "pa" ? item.subcategoryPa : item.subcategoryEn}</option>)}
                        </select>
                        <span style={styles.arrow}>▼</span>
                      </div>
                    </div>

                    <div className="civic-desc" style={styles.field}>
                      <label style={styles.label}>{t.description}</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ ...styles.fieldIcon, top: 17, transform: "none" }}>✎</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.descriptionPlaceholder} rows={3} required maxLength={2000}
                          style={{ ...fieldInputStyle, ...styles.textarea }} />
                        <span style={{ position: "absolute", bottom: 10, right: 14, color: "#94a3b8", fontSize: 12 }}>{description.length}/2000</span>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} style={{ ...styles.submit, ...(submitting ? disabledButton : {}) }}>
                    <span>➤</span>{submitting ? "Submitting Response..." : "Submit Response"}<span style={{ fontSize: 22 }}>→</span>
                  </button>

                  {submissionMessage && (
                    <div style={{
                      marginTop: 18, border: `1px solid ${submissionMessage.includes("successfully") ? "#a7f3d0" : "#fecaca"}`,
                      borderRadius: 12, background: submissionMessage.includes("successfully") ? "#ecfdf5" : "#fef2f2",
                      color: submissionMessage.includes("successfully") ? "#047857" : "#b91c1c",
                      padding: 15, textAlign: "center", fontSize: 14, fontWeight: 700,
                    }}>{submissionMessage}</div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer id="about" style={styles.footer}>
        <div className="civic-footer-inner" style={styles.footerInner}>
          <div className="civic-footer-line" style={styles.footerLine} />
          <p><strong>Civic Priorities Portal</strong><span style={{ margin: "0 9px", color: "#94a3b8" }}>|</span>Your voice, your community, your priorities.</p>
          <div className="civic-footer-line" style={styles.footerLine} />
        </div>
      </footer>
    </div>
  );
}

export default App;

