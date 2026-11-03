import { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  getDistricts,
  getDashboardStats,
  sendOTP,
  verifyOTP,
  submitSubmission,
} from "./services/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #142b3b;
  background: #f5f8f8;
  font-synthesis: none;
}

* { box-sizing: border-box; }
body { margin: 0; background: #f5f8f8; }
button, input, select, textarea { font: inherit; }

.page { min-height: 100vh; overflow: hidden; }

.topbar {
  height: 78px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 max(5.5vw, 24px);
  border-bottom: 1px solid #e8eeee;
  position: relative;
  z-index: 2;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  font: 800 21px Manrope, sans-serif;
  letter-spacing: -.7px;
  color: #153b4b;
}

.brandmark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #0c8d83;
  color: white;
  display: grid;
  place-items: center;
  font-size: 21px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 30px;
  color: #536773;
  font-size: 13px;
  font-weight: 600;
}

.nav a { color: inherit; text-decoration: none; }

.lang {
  border: 1px solid #dce7e6;
  border-radius: 9px;
  padding: 9px 12px;
  background: #fff;
  color: #29434e;
}

.hero {
  background: linear-gradient(115deg, #083c4a 0%, #0a5960 60%, #0c7772 100%);
  color: #fff;
  padding: 66px max(7vw, 24px) 78px;
  position: relative;
  min-height: 380px;
}

.hero-inner {
  max-width: 1150px;
  margin: auto;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  align-items: center;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #a8e4d8;
  font-weight: 700;
}

.hero h1 {
  font: 800 clamp(34px, 4.5vw, 55px)/1.12 Manrope, sans-serif;
  letter-spacing: -1.8px;
  margin: 17px 0 16px;
  max-width: 620px;
}

.hero p {
  color: #d2e9e6;
  line-height: 1.75;
  max-width: 530px;
  font-size: 15px;
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 27px;
  flex-wrap: wrap;
}

.btn {
  border: 0;
  border-radius: 9px;
  padding: 13px 19px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.btn-primary {
  background: #f4c96b;
  color: #173d48;
}

.btn-outline {
  background: transparent;
  border: 1px solid #8ab9b5;
  color: white;
}

.btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.art {
  height: 230px;
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
}

.sun {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f4c96b;
  right: 20%;
  top: 0;
  opacity: .95;
}

.hill {
  position: absolute;
  bottom: 0;
  border-radius: 100% 100% 0 0;
}

.hill.one {
  height: 125px;
  width: 110%;
  background: #0e8b80;
  left: -5%;
}

.hill.two {
  height: 88px;
  width: 100%;
  background: #39a89a;
  left: 5%;
  opacity: .85;
}

.building {
  position: absolute;
  bottom: 43px;
  background: #eaf5ee;
  border-radius: 5px 5px 0 0;
  width: 62px;
  height: 112px;
  left: 33%;
  box-shadow: inset 0 -7px #d4e7df;
}

.building:before {
  content: '';
  position: absolute;
  inset: 14px 12px;
  background:
    repeating-linear-gradient(90deg, #75b8ad 0 8px, transparent 8px 18px),
    repeating-linear-gradient(0deg, transparent 0 17px, #75b8ad 17px 24px);
}

.building.b2 {
  height: 78px;
  width: 48px;
  left: 56%;
  background: #fff0d3;
}

.building.b2:before {
  background:
    repeating-linear-gradient(90deg, #d4a95a 0 7px, transparent 7px 16px),
    repeating-linear-gradient(0deg, transparent 0 15px, #d4a95a 15px 21px);
}

.content {
  max-width: 1120px;
  margin: -35px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stat {
  background: #fff;
  border: 1px solid #e8eeee;
  border-radius: 14px;
  padding: 21px 22px;
  box-shadow: 0 8px 24px #163f4a0a;
}

.stat small {
  color: #71838a;
  font-size: 12px;
  font-weight: 600;
}

.stat strong {
  display: block;
  font: 800 27px Manrope, sans-serif;
  margin-top: 8px;
  color: #123f4c;
}

.stat span {
  font-size: 11px;
  color: #0c9283;
}

.section { padding: 56px 0 15px; }

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 18px;
  margin-bottom: 23px;
}

.section h2 {
  font: 800 27px Manrope, sans-serif;
  letter-spacing: -.7px;
  margin: 0;
  color: #173c49;
}

.section-head p {
  margin: 7px 0 0;
  color: #72828a;
  font-size: 13px;
}

.filters {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

.field, select, textarea {
  width: 100%;
  border: 1px solid #dce6e5;
  border-radius: 9px;
  background: #fff;
  padding: 12px 13px;
  color: #183a45;
  outline: none;
}

.filters select {
  width: auto;
  min-width: 145px;
  padding: 9px 12px;
  font-size: 12px;
}

.field:focus, select:focus, textarea:focus {
  border-color: #0b9588;
  box-shadow: 0 0 0 3px #0b95881a;
}

.categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 13px;
}

.category {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #e6eeee;
  border-radius: 12px;
  padding: 17px;
}

.cat-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  background: #e5f5f1;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.category strong {
  display: block;
  font-size: 14px;
}

.category small {
  color: #829198;
  font-size: 11px;
  display: block;
  margin-top: 4px;
}

.form-wrap {
  margin: 56px 0 70px;
  background: #fff;
  border: 1px solid #e5eeee;
  border-radius: 17px;
  box-shadow: 0 12px 36px #173f4a0a;
  display: grid;
  grid-template-columns: .78fr 1.22fr;
  overflow: hidden;
}

.form-intro {
  background: #e8f5f1;
  padding: 36px;
}

.form-intro .eyebrow { color: #0a8a7c; }

.form-intro h2 {
  font: 800 28px/1.2 Manrope;
  margin: 15px 0;
  color: #173f49;
}

.form-intro p {
  font-size: 13px;
  line-height: 1.8;
  color: #607a7b;
}

.secure {
  margin-top: 25px;
  color: #0b8177;
  font-size: 12px;
  font-weight: 700;
}

.form-body { padding: 34px; }

.form-body h3 {
  font: 800 20px Manrope;
  margin: 0 0 7px;
}

.subtext {
  color: #788990;
  font-size: 12px;
  margin: 0 0 22px;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group { margin-bottom: 15px; }

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #405963;
  margin-bottom: 7px;
}

.otp-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 9px;
}

.status {
  font-size: 12px;
  margin: 9px 0;
  color: #0b8277;
}

.error { color: #bf4b42; }

.locked {
  opacity: .55;
  pointer-events: none;
}

.submit {
  background: #087f77;
  color: white;
  width: 100%;
  margin-top: 5px;
}

.footer {
  background: #103d49;
  color: #d6e7e5;
  padding: 27px max(5.5vw, 24px);
  display: flex;
  justify-content: space-between;
  gap: 15px;
  font-size: 12px;
}

.footer strong { color: #fff; }

@media (max-width: 760px) {
  .topbar { height: 68px; }
  .nav { gap: 12px; }
  .nav a { display: none; }
  .hero { padding-top: 48px; }
  .hero-inner { grid-template-columns: 1fr; }
  .art {
    height: 170px;
    max-width: 400px;
    width: 100%;
    margin: auto;
  }
  .hero h1 { font-size: 38px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .section-head {
    align-items: start;
    flex-direction: column;
  }
  .categories { grid-template-columns: 1fr 1fr; }
  .form-wrap { grid-template-columns: 1fr; }
  .form-intro { padding: 27px; }
  .form-body { padding: 25px; }
  .footer { flex-direction: column; }
}

@media (max-width: 470px) {
  .categories { grid-template-columns: 1fr; }
  .grid2 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 33px; }
  .stats { gap: 9px; }
  .stat { padding: 16px; }
  .stat strong { font-size: 23px; }
  .filters select {
    flex: 1;
    min-width: 0;
  }
  .otp-row { grid-template-columns: 1fr; }
  .lang {
    padding: 8px;
    font-size: 11px;
  }
}
`;

const getList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.categories)) return result.categories;
  if (Array.isArray(result?.districts)) return result.districts;
  if (Array.isArray(result?.items)) return result.items;
  return [];
};

const getId = (item) =>
  item?.districtId ??
  item?.categoryId ??
  item?.subcategoryId ??
  item?.constituencyId ??
  item?.id ??
  item?._id ??
  item?.value ??
  item?.code ??
  "";

const getName = (item) =>
  item?.districtEn ??
  item?.categoryEn ??
  item?.subcategoryEn ??
  item?.constituencyEn ??
  item?.name ??
  item?.title ??
  item?.label ??
  item?.category_name ??
  item?.district_name ??
  "";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
const [dashboardStats, setDashboardStats] = useState({
  totalSubmissions: 0,
  districtWise: [],
  constituencyWise: [],
  categoryWise: [],
});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [language, setLanguage] = useState("English");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");

  const [districtFilter, setDistrictFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");





useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const stats = await getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  fetchDashboardStats();
}, []); 





  // Load categories and districts from API
  useEffect(() => {
    let active = true;

    Promise.all([getCategories(), getDistricts()])
      .then(([categoryResult, districtResult]) => {
        if (!active) return;

        setCategories(getList(categoryResult));
        setDistricts(getList(districtResult));
      })
      .catch(() => {
        if (active) {
          setMessage(
            "Unable to load categories or districts. Please refresh the page."
          );
          setMessageType("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Get constituencies based on selected district
  const selectedDistrict = districts.find(
    (item) => String(getId(item)) === String(district)
  );

  const constituencies =
    selectedDistrict?.constituencies ??
    selectedDistrict?.assemblies ??
    selectedDistrict?.assembly_constituencies ??
    [];

  // Get subcategories based on selected category
  const selectedCategory = categories.find(
    (item) => String(getId(item)) === String(category)
  );

  const subcategories =
    selectedCategory?.subcategories ??
    selectedCategory?.children ??
    [];

  // Filter category cards
  const filteredCategories = useMemo(() => {
    if (!categoryFilter) return categories;

    return categories.filter(
      (item) => String(getId(item)) === String(categoryFilter)
    );
  }, [categories, categoryFilter]);

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showMessage(
        "Please enter a valid 10-digit Indian mobile number.",
        "error"
      );
      return;
    }

    setOtpLoading(true);
    showMessage("");

    try {
      const response = await sendOTP(mobile);

      if (
        response?.success === false ||
        response?.status === "error"
      ) {
        throw new Error(
          response?.message || "Unable to send OTP."
        );
      }

      setOtpSent(true);
      setVerified(false);

      showMessage(
        response?.message ||
          "OTP sent successfully. Please check your mobile."
      );
    } catch (error) {
      showMessage(
        error?.message || "Unable to send OTP. Please try again.",
        "error"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      showMessage("Please enter the 6-digit OTP.", "error");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await verifyOTP(mobile, otp);

      const ok =
        response === true ||
        response?.success === true ||
        response?.verified === true ||
        response?.status === "success";

      if (!ok) {
        throw new Error(
          response?.message || "Invalid OTP. Please try again."
        );
      }

      setVerified(true);
      showMessage("Mobile number verified successfully.");
    } catch (error) {
      setVerified(false);

      showMessage(
        error?.message || "OTP verification failed.",
        "error"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit civic priority
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!verified) {
      return showMessage(
        "Please verify your mobile number before submitting.",
        "error"
      );
    }

    if (
      !district ||
      !constituency ||
      !category ||
      !subcategory ||
      !description.trim()
    ) {
      return showMessage(
        "Please complete all required fields.",
        "error"
      );
    }

    setLoading(true);

    try {
      const payload = {
        mobile,
        district,
        constituency,
        category,
        subcategory,
        description: description.trim(),
        language,
      };

      const response = await submitSubmission(payload);

      if (
        response?.success === false ||
        response?.status === "error"
      ) {
        throw new Error(
          response?.message || "Submission failed. Please try again."
        );
      }

      showMessage(
        response?.message ||
          "Your civic priority has been submitted successfully."
      );

      setDistrict("");
      setConstituency("");
      setCategory("");
      setSubcategory("");
      setDescription("");
    } catch (error) {
      showMessage(
        error?.message ||
          "Unable to submit your response. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fallback category cards if API categories are unavailable
  const categoryCards = [
    ["🛣️", "Roads & Transport", "312 submissions"],
    ["💧", "Water & Sanitation", "246 submissions"],
    ["🏥", "Healthcare", "198 submissions"],
    ["📚", "Education", "184 submissions"],
    ["💼", "Jobs & Livelihood", "176 submissions"],
    ["🛡️", "Public Safety", "168 submissions"],
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="page">
        {/* Header */}
        <header className="topbar">
          <div className="brand">
            <div className="brandmark">✳</div>
            <span>Civic Priorities</span>
          </div>

          <nav className="nav">
            <a href="#priorities">Priorities</a>
            <a href="#how-it-works">How it works</a>
            <a href="#submit">Submit feedback</a>

            <select
              className="lang"
              aria-label="Select language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
            </select>
          </nav>
        </header>

        {/* Hero section */}
        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="eyebrow">
                Your voice. Your neighbourhood. Your future.
              </div>

              <h1>
                Let's build a better community, together.
              </h1>

              <p>
                Share the issues that matter most in your neighbourhood.
                Your feedback helps shape local priorities and create
                meaningful change.
              </p>

              <div className="hero-actions">
                <a href="#submit">
                  <button className="btn btn-primary">
                    Share your priority&nbsp; →
                  </button>
                </a>

                <a href="#priorities">
                  <button className="btn btn-outline">
                    Explore priorities
                  </button>
                </a>
              </div>
            </div>

            {/* CSS city illustration */}
            <div className="art" aria-hidden="true">
              <div className="sun"></div>
              <div className="hill one"></div>
              <div className="hill two"></div>
              <div className="building"></div>
              <div className="building b2"></div>
            </div>
          </div>
        </section>

        <main className="content">
          {/* Statistics */}
          <div className="stats">
  <div className="stat">
    <small>Total community submissions</small>
    <strong>
      {dashboardStats.totalSubmissions.toLocaleString("en-IN")}
    </strong>
    <span>↑ Community voices count</span>
  </div>

  <div className="stat">
    <small>Priority categories</small>
    <strong>{categories.length.toString().padStart(2, "0")}</strong>
    <span>Across local services</span>
  </div>

  <div className="stat">
    <small>District coverage</small>
    <strong>{districts.length || "—"}</strong>
    <span>Participating districts</span>
  </div>

  <div className="stat">
    <small>Open participation</small>
    <strong>24/7</strong>
    <span>Share anytime, anywhere</span>
  </div>
</div>

          {/* Community priorities */}
          <section className="section" id="priorities">
            <div className="section-head">
              <div>
                <h2>What matters to your community?</h2>
                <p>
                  Explore the most discussed civic priorities.
                </p>
              </div>

              <div className="filters">
                <select
                  aria-label="Filter by district"
                  value={districtFilter}
                  onChange={(e) =>
                    setDistrictFilter(e.target.value)
                  }
                >
                  <option value="">All districts</option>

                  {districts.map((d) => (
                    <option key={getId(d)} value={getId(d)}>
                      {getName(d)}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by category"
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                >
                  <option value="">All categories</option>

                  {categories.map((c) => (
                    <option key={getId(c)} value={getId(c)}>
                      {getName(c)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="categories">
              {(filteredCategories.length
                ? filteredCategories
                : categoryCards
              ).map((item, index) => {
                const isApiItem = !Array.isArray(item);

                const title = isApiItem
                  ? getName(item)
                  : item[1];

                const count = isApiItem
                  ? item.count ??
                    item.submission_count ??
                    "Community priority"
                  : item[2];

                const icon = isApiItem
                  ? item.icon ??
                    ["🛣️", "💧", "🏥", "📚", "💼", "🛡️"][
                      index % 6
                    ]
                  : item[0];

                return (
                  <div
                    className="category"
                    key={isApiItem ? getId(item) : title}
                  >
                    <div className="cat-icon">{icon}</div>

                    <div>
                      <strong>{title}</strong>
                      <small>{count}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How it works */}
          <section className="section" id="how-it-works">
            <div className="section-head">
              <div>
                <h2>Your feedback makes a difference</h2>
                <p>
                  A simple, secure way to help improve the places
                  we call home.
                </p>
              </div>
            </div>

            <div className="categories">
              <div className="category">
                <div className="cat-icon">📱</div>
                <div>
                  <strong>1. Verify your number</strong>
                  <small>
                    Confirm your mobile number with a secure OTP.
                  </small>
                </div>
              </div>

              <div className="category">
                <div className="cat-icon">📝</div>
                <div>
                  <strong>2. Share your priority</strong>
                  <small>
                    Choose a location and tell us what needs attention.
                  </small>
                </div>
              </div>

              <div className="category">
                <div className="cat-icon">🤝</div>
                <div>
                  <strong>3. Make an impact</strong>
                  <small>
                    Your input helps inform community decisions.
                  </small>
                </div>
              </div>
            </div>
          </section>

          {/* Submission form */}
          <section className="form-wrap" id="submit">
            <aside className="form-intro">
              <div className="eyebrow">Be part of the change</div>

              <h2>Your voice can shape tomorrow.</h2>

              <p>
                Tell us about the civic issue or improvement that
                matters to you. Every submission helps build a clearer
                picture of community needs.
              </p>

              <div className="secure">
                🔒 &nbsp;Secure OTP-based verification
              </div>
            </aside>

            <form className="form-body" onSubmit={handleSubmit}>
              <h3>Submit your civic priority</h3>

              <p className="subtext">
                Fields marked with * are required.
              </p>

              {/* Mobile number */}
              <div className="form-group">
                <label htmlFor="mobile">Mobile number *</label>

                <div className="otp-row">
                  <input
                    id="mobile"
                    className="field"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    disabled={verified}
                    onChange={(e) => {
                      setMobile(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      );
                      setOtpSent(false);
                      setVerified(false);
                      setOtp("");
                    }}
                  />

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={otpLoading || verified}
                    onClick={handleSendOtp}
                  >
                    {otpLoading
                      ? "Please wait…"
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP verification */}
              {otpSent && !verified && (
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP *</label>

                  <div className="otp-row">
                    <input
                      id="otp"
                      className="field"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={otpLoading}
                      onClick={handleVerifyOtp}
                    >
                      {otpLoading ? "Verifying…" : "Verify OTP"}
                    </button>
                  </div>
                </div>
              )}

              {verified && (
                <p className="status">
                  ✓ Mobile number verified. You can now complete the form.
                </p>
              )}

              {message && (
                <p
                  className={`status ${
                    messageType === "error" ? "error" : ""
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Fields remain locked until OTP verification */}
              <div className={verified ? "" : "locked"}>
                <div className="grid2">
                  {/* District */}
                  <div className="form-group">
                    <label htmlFor="district">District *</label>

                    <select
                      id="district"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setConstituency("");
                      }}
                      disabled={!verified}
                    >
                      <option value="">Select district</option>

                      {districts.map((d) => (
                        <option
                          key={getId(d)}
                          value={getId(d)}
                        >
                          {getName(d)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assembly constituency */}
                  <div className="form-group">
                    <label htmlFor="constituency">
                      Assembly constituency *
                    </label>

                    <select
                      id="constituency"
                      value={constituency}
                      onChange={(e) =>
                        setConstituency(e.target.value)
                      }
                      disabled={!verified || !district}
                    >
                      <option value="">Select constituency</option>

                      {constituencies.map((c) => (
                        <option
                          key={getId(c) || c}
                          value={getId(c) || c}
                        >
                          {getName(c) || c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>

                    <select
                      id="category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("");
                      }}
                      disabled={!verified}
                    >
                      <option value="">Select category</option>

                      {categories.map((c) => (
                        <option
                          key={getId(c)}
                          value={getId(c)}
                        >
                          {getName(c)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div className="form-group">
                    <label htmlFor="subcategory">
                      Subcategory *
                    </label>

                    <select
                      id="subcategory"
                      value={subcategory}
                      onChange={(e) =>
                        setSubcategory(e.target.value)
                      }
                      disabled={!verified || !category}
                    >
                      <option value="">Select subcategory</option>

                      {subcategories.map((s) => (
                        <option
                          key={getId(s) || s}
                          value={getId(s) || s}
                        >
                          {getName(s) || s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description">
                    Describe your concern or suggestion *
                  </label>

                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Please describe the issue, its location, and how it affects your community…"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    disabled={!verified}
                  />
                </div>

                <button
                  className="btn submit"
                  type="submit"
                  disabled={!verified || loading}
                >
                  {loading
                    ? "Submitting…"
                    : "Submit your priority →"}
                </button>
              </div>
            </form>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div>
            <strong>Civic Priorities</strong>
            <br />
            Building stronger communities through participation.
          </div>

          <div>
            © {new Date().getFullYear()} Civic Priorities. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}