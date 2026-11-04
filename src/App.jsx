import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  getCategories,
  getDistricts,
  getDashboardStats,
  sendOTP,
  verifyOTP,
  submitSubmission,
} from "./services/api";

/*
Expected API data (either nested or flat records are supported):

Districts:
[
  {
    districtId: "D01",
    districtEn: "Ludhiana",
    constituencies: [
      { constituencyId: "AC01", constituencyEn: "Ludhiana East" }
    ]
  }
]
OR flat rows:
[
  {
    districtId: "D01",
    districtEn: "Ludhiana",
    constituencyId: "AC01",
    constituencyEn: "Ludhiana East"
  }
]

Categories:
[
  {
    categoryId: "CAT01",
    categoryEn: "Education",
    subcategories: [
      { subcategoryId: "SUB01", subcategoryEn: "School Facilities" }
    ]
  }
]
OR flat rows:
[
  {
    categoryId: "CAT01",
    categoryEn: "Education",
    subcategoryId: "SUB01",
    subcategoryEn: "School Facilities"
  }
]
*/

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
  min-height: 78px; background: #fff; display: flex; align-items: center;
  justify-content: space-between; padding: 12px max(5.5vw, 24px);
  border-bottom: 1px solid #e8eeee; position: relative; z-index: 2;
}
.brand { display: flex; align-items: center; gap: 11px; font: 800 21px Manrope,sans-serif; color: #153b4b; }
.brandmark {
  width: 38px; height: 38px; border-radius: 12px; background: #0c8d83;
  color: white; display: grid; place-items: center; font-size: 21px;
}
.nav { display: flex; align-items: center; gap: 25px; color: #536773; font-size: 13px; font-weight: 600; }
.nav a { color: inherit; text-decoration: none; }
.lang { border: 1px solid #dce7e6; border-radius: 9px; padding: 9px 12px; background: #fff; color: #29434e; }
.hero {
  background: linear-gradient(115deg,#083c4a 0%,#0a5960 60%,#0c7772 100%);
  color: #fff; padding: 66px max(7vw,24px) 78px; min-height: 380px;
}
.hero-inner {
  max-width: 1150px; margin: auto; display: grid; grid-template-columns: 1.1fr .9fr;
  align-items: center; gap: 30px;
}
.eyebrow { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #a8e4d8; font-weight: 700; }
.hero h1 { font: 800 clamp(34px,4.5vw,55px)/1.12 Manrope,sans-serif; letter-spacing: -1.8px; margin: 17px 0 16px; max-width: 620px; }
.hero p { color: #d2e9e6; line-height: 1.75; max-width: 530px; font-size: 15px; margin: 0; }
.hero-actions { display: flex; gap: 12px; margin-top: 27px; flex-wrap: wrap; }
.btn { border: 0; border-radius: 9px; padding: 13px 19px; font-weight: 700; cursor: pointer; transition: .2s; }
.btn-primary { background: #f4c96b; color: #173d48; }
.btn-outline { background: transparent; border: 1px solid #8ab9b5; color: white; }
.btn:disabled { opacity: .55; cursor: not-allowed; }
.art { height: 230px; position: relative; display: flex; align-items: end; justify-content: center; }
.sun { position: absolute; width: 150px; height: 150px; border-radius: 50%; background: #f4c96b; right: 20%; top: 0; }
.hill { position: absolute; bottom: 0; border-radius: 100% 100% 0 0; }
.hill.one { height: 125px; width: 110%; background: #0e8b80; left: -5%; }
.hill.two { height: 88px; width: 100%; background: #39a89a; left: 5%; opacity: .85; }
.building { position: absolute; bottom: 43px; background: #eaf5ee; border-radius: 5px 5px 0 0; width: 62px; height: 112px; left: 33%; box-shadow: inset 0 -7px #d4e7df; }
.building:before {
  content: ''; position: absolute; inset: 14px 12px;
  background: repeating-linear-gradient(90deg,#75b8ad 0 8px,transparent 8px 18px),
  repeating-linear-gradient(0deg,transparent 0 17px,#75b8ad 17px 24px);
}
.building.b2 { height: 78px; width: 48px; left: 56%; background: #fff0d3; }
.building.b2:before {
  background: repeating-linear-gradient(90deg,#d4a95a 0 7px,transparent 7px 16px),
  repeating-linear-gradient(0deg,transparent 0 15px,#d4a95a 15px 21px);
}
.content { max-width: 1120px; margin: -35px auto 0; padding: 0 24px; position: relative; z-index: 1; }
.stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat { background: #fff; border: 1px solid #e8eeee; border-radius: 14px; padding: 21px 22px; box-shadow: 0 8px 24px #163f4a0a; }
.stat small { color: #71838a; font-size: 12px; font-weight: 600; }
.stat strong { display: block; font: 800 27px Manrope,sans-serif; margin-top: 8px; color: #123f4c; }
.stat span { font-size: 11px; color: #0c9283; }
.section { padding: 56px 0 15px; }
.section-head { display: flex; justify-content: space-between; align-items: end; gap: 18px; margin-bottom: 23px; }
.section h2 { font: 800 27px Manrope,sans-serif; letter-spacing: -.7px; margin: 0; color: #173c49; }
.section-head p { margin: 7px 0 0; color: #72828a; font-size: 13px; }
.filters { display: flex; gap: 9px; flex-wrap: wrap; }
.field, select, textarea {
  width: 100%; border: 1px solid #dce6e5; border-radius: 9px; background: #fff;
  padding: 12px 13px; color: #183a45; outline: none;
}
.filters select { width: auto; min-width: 145px; padding: 9px 12px; font-size: 12px; }
.field:focus, select:focus, textarea:focus { border-color: #0b9588; box-shadow: 0 0 0 3px #0b95881a; }
.categories { display: grid; grid-template-columns: repeat(3,1fr); gap: 13px; }
.category { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid #e6eeee; border-radius: 12px; padding: 17px; }
.cat-icon { width: 43px; height: 43px; border-radius: 12px; background: #e5f5f1; display: grid; place-items: center; font-size: 20px; flex: 0 0 auto; }
.category strong { display: block; font-size: 14px; }
.category small { color: #829198; font-size: 11px; display: block; margin-top: 4px; }
.form-wrap {
  margin: 56px 0 70px; background: #fff; border: 1px solid #e5eeee; border-radius: 17px;
  box-shadow: 0 12px 36px #173f4a0a; display: grid; grid-template-columns: .78fr 1.22fr; overflow: hidden;
}
.form-intro { background: #e8f5f1; padding: 36px; }
.form-intro .eyebrow { color: #0a8a7c; }
.form-intro h2 { font: 800 28px/1.2 Manrope,sans-serif; margin: 15px 0; color: #173f49; }
.form-intro p { font-size: 13px; line-height: 1.8; color: #607a7b; }
.secure { margin-top: 25px; color: #0b8177; font-size: 12px; font-weight: 700; }
.form-body { padding: 34px; }
.form-body h3 { font: 800 20px Manrope,sans-serif; margin: 0 0 7px; }
.subtext { color: #788990; font-size: 12px; margin: 0 0 22px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.form-group { margin-bottom: 15px; min-width: 0; }
.form-group label { display: block; font-size: 12px; font-weight: 700; color: #405963; margin-bottom: 7px; }
.otp-row { display: grid; grid-template-columns: 1fr auto; gap: 9px; }
.status { font-size: 12px; margin: 9px 0; color: #0b8277; line-height: 1.5; }
.error { color: #bf4b42; }
.locked { opacity: .65; }
.submit { background: #087f77; color: white; width: 100%; margin-top: 5px; }
.footer { background: #103d49; color: #d6e7e5; padding: 27px max(5.5vw,24px); display: flex; justify-content: space-between; gap: 15px; font-size: 12px; }
.footer strong { color: #fff; }
@media(max-width:760px) {
  .topbar { min-height: 68px; }
  .nav { gap: 12px; }
  .nav a { display: none; }
  .hero { padding-top: 48px; }
  .hero-inner { grid-template-columns: 1fr; }
  .art { height: 170px; max-width: 400px; width: 100%; margin: auto; }
  .hero h1 { font-size: 38px; }
  .stats { grid-template-columns: repeat(2,1fr); }
  .section-head { align-items: start; flex-direction: column; }
  .categories { grid-template-columns: 1fr 1fr; }
  .form-wrap { grid-template-columns: 1fr; }
  .form-intro { padding: 27px; }
  .form-body { padding: 25px; }
  .footer { flex-direction: column; }
}
@media(max-width:470px) {
  .categories, .grid2 { grid-template-columns: 1fr; }
  .hero h1 { font-size: 33px; }
  .stats { gap: 9px; }
  .stat { padding: 16px; }
  .stat strong { font-size: 23px; }
  .filters select { flex: 1; min-width: 0; }
  .otp-row { grid-template-columns: 1fr; }
  .lang { padding: 8px; font-size: 11px; }
}

/* How it works: editorial layout, responsive cards and subtle motion */
.how-section {
  position: relative;
  padding: 68px 0 28px;
  scroll-margin-top: 28px;
}
.how-heading { max-width: 720px; margin: 0 auto 34px; text-align: center; }
.how-heading .eyebrow { color: #0b9285; }
.how-heading h2 {
  font: 800 clamp(28px, 3.5vw, 39px)/1.16 Manrope,sans-serif;
  color: #153d49; letter-spacing: -1.1px; margin: 12px 0;
}
.how-heading p { color: #71838a; line-height: 1.8; font-size: 14px; margin: 0 auto; }
.how-intro {
  max-width: 900px; margin: 0 auto 30px; padding: 25px 29px;
  border: 1px solid #d9eeea; border-radius: 17px;
  background: linear-gradient(120deg,#effaf6,#fff 72%);
  color: #526d70; line-height: 1.85; font-size: 14px;
  box-shadow: 0 12px 35px #164d4a0b;
}
.how-intro strong { color: #0b706a; }
.steps-grid {
  display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 13px;
  counter-reset: howstep;
}
.step-card {
  position: relative; min-height: 218px; padding: 21px 17px;
  background: #fff; border: 1px solid #e4eeec; border-radius: 15px;
  box-shadow: 0 8px 24px #163f4a08;
  transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
  animation: howFadeUp .65s both;
}
.step-card:nth-child(2) { animation-delay: .08s; }
.step-card:nth-child(3) { animation-delay: .16s; }
.step-card:nth-child(4) { animation-delay: .24s; }
.step-card:nth-child(5) { animation-delay: .32s; }
.step-card:hover { transform: translateY(-7px); border-color: #a8d9cf; box-shadow: 0 17px 35px #164d4a16; }
.step-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.step-icon {
  width: 48px; height: 48px; display:grid; place-items:center; border-radius:14px;
  background:#e8f6f2; font-size:23px;
}
.step-number {
  color:#8aa19e; font:800 12px Manrope,sans-serif; letter-spacing:1px;
}
.step-card h3 { color:#173f49; font:800 15px Manrope,sans-serif; margin:0 0 9px; }
.step-card p { color:#71838a; font-size:12px; line-height:1.75; margin:0; }
.how-note {
  display:flex; align-items:flex-start; gap:13px; margin:24px 0 0; padding:18px 21px;
  border-radius:13px; background:#fff8e9; border:1px solid #f3e5c3;
  color:#6e603e; font-size:13px; line-height:1.75;
}
.how-note .note-icon { font-size:20px; flex:0 0 auto; }
.next-section {
  display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:27px;
}
.next-card {
  border:1px solid #e3eeeb; border-radius:16px; padding:24px;
  background:#fff; box-shadow:0 8px 24px #163f4a08;
  transition:transform .25s ease, box-shadow .25s ease;
}
.next-card:hover { transform:translateY(-4px); box-shadow:0 14px 30px #163f4a12; }
.next-card h3 { margin:0 0 12px; color:#173f49; font:800 17px Manrope,sans-serif; }
.next-card p { margin:0; color:#71838a; font-size:13px; line-height:1.85; }
.language-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
.language-chip {
  border-radius:999px; padding:7px 11px; background:#eaf6f2;
  color:#16776e; font-size:11px; font-weight:700;
}
.disclaimer {
  margin-top:18px; padding:23px 25px; border-radius:15px;
  background:#f0f5f6; border:1px solid #dfe9e9;
}
.disclaimer h3 { display:flex; align-items:center; gap:9px; margin:0 0 9px; color:#294c56; font:800 15px Manrope,sans-serif; }
.disclaimer p { margin:0; color:#6e8087; font-size:12px; line-height:1.85; }
@keyframes howFadeUp {
  from { opacity:0; transform:translateY(18px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes gentleFloat {
  0%,100% { transform:translateY(0); }
  50% { transform:translateY(-9px); }
}
.sun { animation: gentleFloat 5s ease-in-out infinite; }
.cat-icon { transition:transform .25s ease, background .25s ease; }
.category:hover .cat-icon { transform:rotate(-7deg) scale(1.08); background:#d8f1e9; }
@media(max-width:1000px) {
  .steps-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
}
@media(max-width:760px) {
  .how-section { padding-top:48px; }
  .steps-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .next-section { grid-template-columns:1fr; }
}
@media(max-width:470px) {
  .steps-grid { grid-template-columns:1fr; }
  .step-card { min-height:0; }
  .how-intro { padding:20px; }
}
@media(prefers-reduced-motion:reduce) {
  *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; }
}

`;

// Convert common API response wrappers into an array.
const getList = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.categories)) return result.categories;
  if (Array.isArray(result?.districts)) return result.districts;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.result)) return result.result;
  return [];
};

const firstValue = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const getDistrictId = (item) =>
  firstValue(item, ["districtId", "district_id", "id", "_id", "code", "value"]);

const getDistrictName = (item) =>
  firstValue(item, ["districtEn", "district_name", "districtName", "name", "title", "label"]);

const getCategoryId = (item) =>
  firstValue(item, ["categoryId", "category_id", "id", "_id", "code", "value"]);

const getCategoryName = (item) =>
  firstValue(item, ["categoryEn", "category_name", "categoryName", "name", "title", "label"]);

const getChildId = (item, type) => {
  if (type === "constituency") {
    return firstValue(item, ["constituencyId", "constituency_id", "assemblyId", "assembly_id", "id", "_id", "code", "value"]);
  }
  return firstValue(item, ["subcategoryId", "subcategory_id", "id", "_id", "code", "value"]);
};

const getChildName = (item, type) => {
  if (type === "constituency") {
    return firstValue(item, ["constituencyEn", "constituency_name", "constituencyName", "assemblyEn", "assembly_name", "name", "title", "label"]);
  }
  return firstValue(item, ["subcategoryEn", "subcategory_name", "subcategoryName", "name", "title", "label"]);
};

const getChildPunjabi = (item, type) => {
  if (type === "constituency") {
    return firstValue(item, ["constituencyPa", "constituency_pa", "assemblyPa"]);
  }
  return firstValue(item, ["subcategoryPa", "subcategory_pa"]);
};

const uniqueById = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const id = String(item.id ?? "");
    if (id && !map.has(id)) map.set(id, item);
  });
  return [...map.values()];
};

const getNestedArray = (item, keys) => {
  for (const key of keys) {
    if (Array.isArray(item?.[key])) return item[key];
  }
  return [];
};

export default function App() {
  const [categories, setCategories] = useState([]);
  
  const [districts, setDistricts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSubmissions: 0,
    districtWise: [],
    constituencyWise: [],
    categoryWise: [],
  });

  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [language, setLanguage] = useState("en");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");

  const [districtFilter, setDistrictFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

const showMessage = (text, type = "success") => {
  setMessage(text);
  setMessageType(type);

  if (!text) return;

  const isError = type === "error";

  Swal.fire({
    icon: isError ? "error" : "success",
    title: isError ? "Something went wrong" : "Success",
    text: text,
    confirmButtonText: "OK",
    confirmButtonColor: isError ? "#d33" : "#087f77",
    allowOutsideClick: false,
  });
};

  // Load master data from backend.
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setDataLoading(true);
      try {
        const [categoryResult, districtResult, statsResult] = await Promise.all([
          getCategories(),
          getDistricts(),
          getDashboardStats().catch((error) => {
            console.error("Dashboard stats error:", error);
            return null;
          }),
        ]);

        if (!active) return;

        const categoryRows = getList(categoryResult);
        const districtRows = getList(districtResult);

        setCategories(categoryRows);
        setDistricts(districtRows);

        if (statsResult) {
          const stats = statsResult?.data ?? statsResult;
          setDashboardStats((previous) => ({
            ...previous,
            ...stats,
            totalSubmissions: Number(
              stats?.totalSubmissions ?? stats?.total_submissions ?? previous.totalSubmissions
            ),
          }));
        }
      } catch (error) {
        console.error("Master data loading error:", error);
        if (active) {
          showMessage(
            error?.message || "Unable to load categories and districts. Please refresh the page.",
            "error"
          );
        }
      } finally {
        if (active) setDataLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, []);

  // Unique district list for the dropdown and statistics.
  const districtOptions = useMemo(() => {
    const options = districts
      .map((item) => ({
        id: getDistrictId(item),
        name: getDistrictName(item),
        namePa: firstValue(item, ["districtPa", "district_pa"]),
      }))
      .filter((item) => item.id && item.name);
    return uniqueById(options);
  }, [districts]);

  // Unique category list for the dropdown and cards.
  const categoryOptions = useMemo(() => {
    const options = categories
      .map((item) => ({
        id: getCategoryId(item),
        name: getCategoryName(item),
        namePa: firstValue(item, ["categoryPa", "category_pa"]),
        icon: item?.icon,
        count: item?.count ?? item?.submission_count,
      }))
      .filter((item) => item.id && item.name);
    return uniqueById(options);
  }, [categories]);

  // Get all constituencies attached to the selected district.
  // Supports nested records and flat sheet rows.
  const constituencies = useMemo(() => {
    if (!district) return [];

    const rows = [];
    districts.forEach((districtRow) => {
      if (String(getDistrictId(districtRow)) !== String(district)) return;

      const nested = getNestedArray(districtRow, [
        "constituencies",
        "assemblies",
        "assembly_constituencies",
        "assemblyConstituencies",
      ]);

      nested.forEach((child) => {
        rows.push({
          id: getChildId(child, "constituency"),
          name: getChildName(child, "constituency"),
          namePa: getChildPunjabi(child, "constituency"),
        });
      });

      // Also supports flat rows where each record contains district + constituency.
      const flatId = getChildId(districtRow, "constituency");
      const flatName = getChildName(districtRow, "constituency");
      if (flatId && flatName) {
        rows.push({
          id: flatId,
          name: flatName,
          namePa: getChildPunjabi(districtRow, "constituency"),
        });
      }
    });

    return uniqueById(rows.filter((item) => item.id && item.name));
  }, [districts, district]);

  // Get all subcategories attached to the selected category.
  // Supports nested records and flat sheet rows.
  const subcategories = useMemo(() => {
    if (!category) return [];

    const rows = [];
    categories.forEach((categoryRow) => {
      if (String(getCategoryId(categoryRow)) !== String(category)) return;

      const nested = getNestedArray(categoryRow, [
        "subcategories",
        "children",
        "subCategories",
      ]);

      nested.forEach((child) => {
        rows.push({
          id: getChildId(child, "subcategory"),
          name: getChildName(child, "subcategory"),
          namePa: getChildPunjabi(child, "subcategory"),
        });
      });

      // Also supports flat rows where each record contains category + subcategory.
      const flatId = getChildId(categoryRow, "subcategory");
      const flatName = getChildName(categoryRow, "subcategory");
      if (flatId && flatName) {
        rows.push({
          id: flatId,
          name: flatName,
          namePa: getChildPunjabi(categoryRow, "subcategory"),
        });
      }
    });

    return uniqueById(rows.filter((item) => item.id && item.name));
  }, [categories, category]);

  const filteredCategories = useMemo(() => {
    if (!categoryFilter) return categoryOptions;
    return categoryOptions.filter((item) => String(item.id) === String(categoryFilter));
  }, [categoryOptions, categoryFilter]);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showMessage("Please enter a valid 10-digit Indian mobile number.", "error");
      return;
    }

    setOtpLoading(true);
    showMessage("");

    try {
      const response = await sendOTP(mobile);
      if (response?.success === false || response?.status === "error") {
        throw new Error(response?.message || "Unable to send OTP.");
      }

      setOtpSent(true);
      setVerified(false);
      setOtp("");
      showMessage(response?.message || "OTP sent successfully. Please check your mobile.");
    } catch (error) {
      showMessage(error?.message || "Unable to send OTP. Please try again.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

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
        throw new Error(response?.message || "Invalid OTP. Please try again.");
      }

      setVerified(true);
      showMessage("Mobile number verified successfully.");
    } catch (error) {
      setVerified(false);
      showMessage(error?.message || "OTP verification failed.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!verified) {
      showMessage("Please verify your mobile number before submitting.", "error");
      return;
    }

    if (!district || !constituency || !category || !subcategory || !description.trim()) {
      showMessage("Please complete all required fields.", "error");
      return;
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
        response?.status === "error" ||
        response?.ok === false
      ) {
        throw new Error(response?.message || "Submission failed. Please try again.");
      }

      showMessage(
        response?.message || "Your civic priority has been submitted successfully."
      );

      setDistrict("");
      setConstituency("");
      setCategory("");
      setSubcategory("");
      setDescription("");
      setMobile("");
      setOtp("");
      setOtpSent(false);
      setVerified(false);
    } catch (error) {
      showMessage(
        error?.message || "Unable to submit your response. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fallbackCards = [
    ["🛣️", "Roads & Transport", "Community priority"],
    ["💧", "Water & Sanitation", "Community priority"],
    ["🏥", "Healthcare", "Community priority"],
    ["📚", "Education", "Community priority"],
    ["💼", "Jobs & Livelihood", "Community priority"],
    ["🛡️", "Public Safety", "Community priority"],
  ];

  const categoryCardItems = filteredCategories.length
    ? filteredCategories
    : categoryOptions.length === 0
      ? fallbackCards.map(([icon, name, count]) => ({ icon, name, count }))
      : [];

  return (
    <>
      <style>{styles}</style>

      <div className="page">
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
  onChange={(event) => setLanguage(event.target.value)}
>
  <option value="en">English</option>
  <option value="pa">Punjabi</option>
</select>
</nav>
        </header>

        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="eyebrow">Your voice. Your neighbourhood. Your future.</div>
              <h1>Let's build a better community, together.</h1>
              <p>
                Share the issues that matter most in your neighbourhood.
                Your feedback helps shape local priorities and create meaningful change.
              </p>
              <div className="hero-actions">
                <a href="#submit">
                  <button className="btn btn-primary" type="button">
                    Share your priority&nbsp; →
                  </button>
                </a>
                <a href="#priorities">
                  <button className="btn btn-outline" type="button">
                    Explore priorities
                  </button>
                </a>
              </div>
            </div>

            <div className="art" aria-hidden="true">
              <div className="sun" />
              <div className="hill one" />
              <div className="hill two" />
              <div className="building" />
              <div className="building b2" />
            </div>
          </div>
        </section>

        <main className="content">
          <div className="stats">
            <div className="stat">
              <small>Total community submissions</small>
              <strong>{Number(dashboardStats.totalSubmissions || 0).toLocaleString("en-IN")}</strong>
              <span>↑ Community voices count</span>
            </div>
            <div className="stat">
              <small>Priority categories</small>
              <strong>{categoryOptions.length.toString().padStart(2, "0")}</strong>
              <span>Across local services</span>
            </div>
            <div className="stat">
              <small>District coverage</small>
              <strong>{districtOptions.length || "—"}</strong>
              <span>Participating districts</span>
            </div>
            <div className="stat">
              <small>Open participation</small>
              <strong>24/7</strong>
              <span>Share anytime, anywhere</span>
            </div>
          </div>

          <section className="section" id="priorities">
            <div className="section-head">
              <div>
                <h2>What matters to your community?</h2>
                <p>Explore the most discussed civic priorities.</p>
              </div>

              <div className="filters">
                <select
                  aria-label="Filter by district"
                  value={districtFilter}
                  onChange={(event) => setDistrictFilter(event.target.value)}
                >
                  <option value="">All districts</option>
                  {districtOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {language === "Punjabi" ? item.namePa || item.name : item.name}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by category"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="">All categories</option>
                  {categoryOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {language === "Punjabi" ? item.namePa || item.name : item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {dataLoading ? (
              <p className="status">Loading categories and districts…</p>
            ) : categoryCardItems.length ? (
              <div className="categories">
                {categoryCardItems.map((item, index) => {
                  const isFallback = Array.isArray(item);
                  const icon = isFallback ? item[0] : item.icon || ["🛣️", "💧", "🏥", "📚", "💼", "🛡️"][index % 6];
                  const name = isFallback ? item[1] : item.name;
                  const count = isFallback ? item[2] : item.count ?? "Community priority";

                  return (
                    <div className="category" key={isFallback ? name : item.id}>
                      <div className="cat-icon">{icon}</div>
                      <div>
                        <strong>{name}</strong>
                        <small>{count}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="status">No categories found for the selected filter.</p>
            )}
          </section>

          <section className="how-section" id="how-it-works">
            <div className="how-heading">
              <div className="eyebrow">A simple way to make your voice heard</div>
              <h2>How It Works</h2>
              <p>Five simple steps to share what matters in your neighbourhood and help build a clearer picture of local priorities.</p>
            </div>

            <div className="how-intro">
              <strong>Citizens know best what their City Needs.</strong> CityNeeds Community Reporter gives residents a simple way to share the concerns and ideas that matter in their neighbourhood. Your input helps create a clearer picture of local priorities.
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <div className="step-top">
                  <div className="step-icon">📍</div>
                  <span className="step-number">STEP 01</span>
                </div>
                <h3>Choose your area</h3>
                <p>Select your district and Assembly constituency so your input can be understood in the right local context.</p>
              </article>

              <article className="step-card">
                <div className="step-top">
                  <div className="step-icon">🔐</div>
                  <span className="step-number">STEP 02</span>
                </div>
                <h3>Verify your identity</h3>
                <p>Complete the identity verification step. Your verification details will be kept separate from public summaries.</p>
              </article>

              <article className="step-card">
                <div className="step-top">
                  <div className="step-icon">🗺️</div>
                  <span className="step-number">STEP 03</span>
                </div>
                <h3>Tell us where the issue is</h3>
                <p>Enter your locality or a nearby landmark. You do not need to provide your full address.</p>
              </article>

              <article className="step-card">
                <div className="step-top">
                  <div className="step-icon">💬</div>
                  <span className="step-number">STEP 04</span>
                </div>
                <h3>Share your inputs</h3>
                <p>Select a category and describe a concern or suggestion. You can submit up to five inputs per month and include a possible solution if you wish.</p>
              </article>

              <article className="step-card">
                <div className="step-top">
                  <div className="step-icon">✅</div>
                  <span className="step-number">STEP 05</span>
                </div>
                <h3>Review and submit</h3>
                <p>Check your entries before submitting. You will receive a reference number for your submission.</p>
              </article>
            </div>

            <div className="how-note">
              <span className="note-icon">🌐</span>
              <div><strong>Share in the language you are comfortable with.</strong> You may share your inputs in Punjabi, English of these languages.</div>
            </div>

            <div className="next-section">
              <article className="next-card">
                <h3>🔎 What happens next?</h3>
                <p>We review and group submissions by constituency. A monthly newsletter summarising the inputs received will be made available in the public domain and sent to the relevant offices. Public summaries will not include your personal verification details.</p>
              </article>

              <article className="next-card">
                <h3>🗣️ Your voice matters</h3>
                <p>Every input helps create a better understanding of the concerns, needs, and ideas shared by residents across their communities.</p>
                <div className="language-chips">
                  <span className="language-chip">Punjabi</span>                  
                  <span className="language-chip">English</span>
                </div>
              </article>
            </div>

            <div className="disclaimer">
              <h3>⚠️ Disclaimer</h3>
              <p>CityNeeds Community Reporter is a platform for collecting and sharing citizens’ concerns and suggestions. CityNeeds is not an NGO or a complaints-resolution service. We cannot guarantee that a complaint will be resolved or that a suggestion will be implemented.</p>
            </div>
          </section>

          <section className="form-wrap" id="submit">
            <aside className="form-intro">
              <div className="eyebrow">Be part of the change</div>
              <h2>Your voice can shape tomorrow.</h2>
              <p>
                Tell us about the civic issue or improvement that matters to you.
                Every submission helps build a clearer picture of community needs.
              </p>
              <div className="secure">🔒 &nbsp;Secure OTP-based verification</div>
            </aside>

            <form className="form-body" onSubmit={handleSubmit}>
              <h3>Submit your civic priority</h3>
              <p className="subtext">Fields marked with * are required.</p>

              <div className="form-group">
                <label htmlFor="mobile">Mobile number *</label>
                <div className="otp-row">
                  <input
                    id="mobile"
                    className="field"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    disabled={verified}
                    required
                    onChange={(event) => {
                      setMobile(event.target.value.replace(/\D/g, "").slice(0, 10));
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
                    {otpLoading ? "Please wait…" : otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </div>

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
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
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
                <p className="status">✓ Mobile number verified. You can now complete the form.</p>
              )}

              {message && (
                <p className={`status ${messageType === "error" ? "error" : ""}`} role="status">
                  {message}
                </p>
              )}

              <div className={verified ? "" : "locked"}>
                <div className="grid2">
                  <div className="form-group">
                    <label htmlFor="district">District *</label>
                    <select
                      id="district"
                      value={district}
                      required
                      disabled={!verified || dataLoading}
                      onChange={(event) => {
                        setDistrict(event.target.value);
                        setConstituency("");
                      }}
                    >
                      <option value="">Select district</option>
                      {districtOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {language === "Punjabi" ? item.namePa || item.name : item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="constituency">Assembly constituency *</label>
                    <select
                      id="constituency"
                      value={constituency}
                      required
                      disabled={!verified || !district}
                      onChange={(event) => setConstituency(event.target.value)}
                    >
                      <option value="">Select constituency</option>
                      {constituencies.map((item) => (
                        <option key={item.id} value={item.id}>
                          {language === "Punjabi" ? item.namePa || item.name : item.name}
                        </option>
                      ))}
                    </select>
                    {verified && district && constituencies.length === 0 && (
                      <small className="status error">
                        No constituencies returned for this district. Check the district API response.
                      </small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      value={category}
                      required
                      disabled={!verified || dataLoading}
                      onChange={(event) => {
                        setCategory(event.target.value);
                        setSubcategory("");
                      }}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {language === "Punjabi" ? item.namePa || item.name : item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategory *</label>
                    <select
                      id="subcategory"
                      value={subcategory}
                      required
                      disabled={!verified || !category}
                      onChange={(event) => setSubcategory(event.target.value)}
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {language === "Punjabi" ? item.namePa || item.name : item.name}
                        </option>
                      ))}
                    </select>
                    {verified && category && subcategories.length === 0 && (
                      <small className="status error">
                        No subcategories returned for this category. Check the category API response.
                      </small>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Describe your concern or suggestion *</label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Please describe the issue, its location, and how it affects your community…"
                    value={description}
                    required
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={!verified}
                  />
                </div>

                <button className="btn submit" type="submit" disabled={!verified || loading}>
                  {loading ? "Submitting…" : "Submit your priority →"}
                </button>
              </div>
            </form>
          </section>
        </main>

        <footer className="footer">
          <div>
            <strong>Civic Priorities</strong>
            <br />
            Building stronger communities through participation.
          </div>
          <div>© {new Date().getFullYear()} Civic Priorities. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}
