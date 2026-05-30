import { useState, useEffect } from "react";
import { Calendar, FileText, MapPin, DollarSign, Settings, Users, Briefcase, ChevronDown, ChevronUp, Download, Send, CheckCircle, MessageSquare, LogOut, LayoutDashboard, ClipboardList, UserCheck } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const CLIENTS = [
  { id: "C001", name: "Emma Walsh", address: "14 Grafton St, Dublin 2", phone: "085 111 2233", email: "emma@example.com" },
  { id: "C002", name: "Liam O'Brien", address: "5 O'Connell St, Dublin 1", phone: "086 222 3344", email: "liam@example.com" },
  { id: "C003", name: "Siobhan Murphy", address: "22 Merrion Sq, Dublin 2", phone: "087 333 4455", email: "siobhan@example.com" },
];
const CLEANERS = [
  { id: "E001", name: "Ana Costa", location: "Dublin 2", jobsDone: 34, basePay: 680 },
  { id: "E002", name: "Tomás Novak", location: "Dublin 1", jobsDone: 28, basePay: 560 },
  { id: "E003", name: "Priya Nair", location: "Dublin 4", jobsDone: 41, basePay: 820 },
];
const JOBS = [
  { id: "J001", clientId: "C001", cleanerId: "E001", date: "2026-06-02", status: "Scheduled", location: "Dublin 2" },
  { id: "J002", clientId: "C002", cleanerId: null, date: "2026-06-03", status: "Unassigned", location: "Dublin 1" },
  { id: "J003", clientId: "C003", cleanerId: "E003", date: "2026-06-04", status: "Completed", location: "Dublin 4" },
  { id: "J004", clientId: "C001", cleanerId: "E002", date: "2026-06-05", status: "Scheduled", location: "Dublin 2" },
];
const CLIENT_INVOICES = [
  { id: "INV-C001", clientId: "C001", amount: 120, status: "Paid" },
  { id: "INV-C002", clientId: "C002", amount: 95, status: "Pending" },
  { id: "INV-C003", clientId: "C003", amount: 140, status: "Overdue" },
];
const CLEANER_INVOICES = [
  { id: "INV-E001", cleanerId: "E001", amount: 340, status: "Paid" },
  { id: "INV-E002", cleanerId: "E002", amount: 280, status: "Pending" },
  { id: "INV-E003", cleanerId: "E003", amount: 410, status: "Paid" },
];

const CURRENCIES = [
  "EUR - Euro (€)", "USD - US Dollar ($)", "GBP - British Pound (£)", "AUD - Australian Dollar (A$)",
  "CAD - Canadian Dollar (C$)", "CHF - Swiss Franc (CHF)", "JPY - Japanese Yen (¥)", "CNY - Chinese Yuan (¥)",
  "SEK - Swedish Krona (kr)", "NZD - New Zealand Dollar (NZ$)", "MXN - Mexican Peso (MX$)", "SGD - Singapore Dollar (S$)",
  "HKD - Hong Kong Dollar (HK$)", "NOK - Norwegian Krone (kr)", "KRW - South Korean Won (₩)", "INR - Indian Rupee (₹)",
  "BRL - Brazilian Real (R$)", "ZAR - South African Rand (R)", "DKK - Danish Krone (kr)", "PLN - Polish Złoty (zł)",
  "THB - Thai Baht (฿)", "MYR - Malaysian Ringgit (RM)", "IDR - Indonesian Rupiah (Rp)", "AED - UAE Dirham (د.إ)",
  "SAR - Saudi Riyal (﷼)", "TRY - Turkish Lira (₺)", "RUB - Russian Ruble (₽)", "ILS - Israeli Shekel (₪)",
  "PHP - Philippine Peso (₱)", "CZK - Czech Koruna (Kč)", "HUF - Hungarian Forint (Ft)", "RON - Romanian Leu (lei)",
  "CLP - Chilean Peso (CLP)", "COP - Colombian Peso (COL$)", "VND - Vietnamese Đồng (₫)", "ARS - Argentine Peso ($)",
  "PKR - Pakistani Rupee (₨)", "BGN - Bulgarian Lev (лв)", "EGP - Egyptian Pound (£)", "NGN - Nigerian Naira (₦)",
  "UAH - Ukrainian Hryvnia (₴)", "PEN - Peruvian Sol (S/)", "KES - Kenyan Shilling (KSh)", "BDT - Bangladeshi Taka (৳)",
  "MAD - Moroccan Dirham (MAD)", "QAR - Qatari Riyal (﷼)", "KWD - Kuwaiti Dinar (د.ك)", "OMR - Omani Rial (﷼)",
  "JOD - Jordanian Dinar (JD)", "LKR - Sri Lankan Rupee (₨)", "GHS - Ghanaian Cedi (GH₵)", "UYU - Uruguayan Peso ($U)",
  "CRC - Costa Rican Colón (₡)", "ISK - Icelandic Króna (kr)",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusColor = (s) => {
  if (!s) return "#888";
  const m = { Paid: "#0f6e56", Completed: "#0f6e56", Scheduled: "#185fa5", Pending: "#ba7517", Overdue: "#a32d2d", Unassigned: "#993556", Available: "#3b6d11", Unavailable: "#a32d2d" };
  return m[s] || "#888";
};
const statusBg = (s) => {
  const m = { Paid: "#e1f5ee", Completed: "#e1f5ee", Scheduled: "#e6f1fb", Pending: "#faeeda", Overdue: "#fcebeb", Unassigned: "#fbeaf0", Available: "#eaf3de", Unavailable: "#fcebeb" };
  return m[s] || "#f1efe8";
};
const Badge = ({ status }) => (
  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: statusBg(status), color: statusColor(status), letterSpacing: 0.3 }}>{status}</span>
);
const Select = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #d0cfc7", background: "#fff", fontSize: 14, color: "#2c2c2a", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 10px) center" }}>
    <option value="">{placeholder || "Select..."}</option>
    {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);
const Card = ({ children, style }) => (
  <div style={{ background: "#fff", border: "1px solid #e8e7e0", borderRadius: 12, padding: "16px 20px", ...style }}>{children}</div>
);
const SectionTitle = ({ children }) => (
  <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "#2c2c2a", borderBottom: "1px solid #eee", paddingBottom: 10 }}>{children}</h3>
);
const FieldRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f5f4ef", fontSize: 14 }}>
    <span style={{ color: "#888780" }}>{label}</span>
    <span style={{ color: "#2c2c2a", fontWeight: 500 }}>{value}</span>
  </div>
);
const Btn = ({ onClick, children, color = "#2c2c2a", bg = "#f5f4ef" }) => (
  <button onClick={onClick} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: bg, color, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{children}</button>
);

// ─── SECTIONS ────────────────────────────────────────────────────────────────
function JobSchedule() {
  const [selJob, setSelJob] = useState("");
  const [selClient, setSelClient] = useState("");
  const job = JOBS.find(j => j.id === selJob);
  const client = job ? CLIENTS.find(c => c.id === selClient) : null;
  return (
    <div>
      <SectionTitle>Job Schedule</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        <Select value={selJob} onChange={v => { setSelJob(v); setSelClient(""); }} options={JOBS.map(j => ({ value: j.id, label: `${j.id} — ${j.date}` }))} placeholder="Select Job ID" />
        {job && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Date" value={job.date} />
            <FieldRow label="Status" value={<Badge status={job.status} />} />
            <FieldRow label="Location" value={job.location} />
            <div style={{ marginTop: 12 }}>
              <Select value={selClient} onChange={setSelClient} options={CLIENTS.filter(c => c.id === job.clientId).map(c => ({ value: c.id, label: c.name }))} placeholder="Select Client" />
              {client && (
                <div style={{ marginTop: 12 }}>
                  <FieldRow label="Client ID" value={client.id} />
                  <FieldRow label="Name" value={client.name} />
                  <FieldRow label="Address" value={client.address} />
                  <FieldRow label="Phone" value={client.phone} />
                  <FieldRow label="Email" value={client.email} />
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function ClientInvoices() {
  const [selClient, setSelClient] = useState("");
  const inv = CLIENT_INVOICES.find(i => i.clientId === selClient);
  const client = CLIENTS.find(c => c.id === selClient);
  return (
    <div>
      <SectionTitle>Client Invoices</SectionTitle>
      <Card>
        <Select value={selClient} onChange={setSelClient} options={CLIENTS.map(c => ({ value: c.id, label: c.name }))} placeholder="Select Client" />
        {client && inv && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Client" value={client.name} />
            <FieldRow label="Invoice #" value={inv.id} />
            <FieldRow label="Amount" value={`€${inv.amount.toFixed(2)}`} />
            <FieldRow label="Status" value={<Badge status={inv.status} />} />
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Btn bg="#e6f1fb" color="#185fa5"><Download size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Download</Btn>
              <Btn bg="#e1f5ee" color="#0f6e56">View</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function CleanerInvoices() {
  const [selCleaner, setSelCleaner] = useState("");
  const inv = CLEANER_INVOICES.find(i => i.cleanerId === selCleaner);
  const cleaner = CLEANERS.find(c => c.id === selCleaner);
  return (
    <div>
      <SectionTitle>Cleaner Invoices</SectionTitle>
      <Card>
        <Select value={selCleaner} onChange={setSelCleaner} options={CLEANERS.map(c => ({ value: c.id, label: c.name }))} placeholder="Select Cleaner" />
        {cleaner && inv && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Cleaner" value={cleaner.name} />
            <FieldRow label="Invoice #" value={inv.id} />
            <FieldRow label="Amount" value={`€${inv.amount.toFixed(2)}`} />
            <FieldRow label="Status" value={<Badge status={inv.status} />} />
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Btn bg="#e6f1fb" color="#185fa5"><Download size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Download</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function ManualCheckin() {
  const [selClient, setSelClient] = useState("");
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const client = CLIENTS.find(c => c.id === selClient);
  return (
    <div>
      <SectionTitle>Manual Check-in — Clients</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        <Select value={selClient} onChange={setSelClient} options={CLIENTS.map(c => ({ value: c.id, label: c.name }))} placeholder="Select Client" />
        {client && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Client ID" value={client.id} />
            <FieldRow label="Address" value={client.address} />
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d0cfc7", fontSize: 14 }} />
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d0cfc7", fontSize: 14 }} />
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes..." rows={2} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d0cfc7", fontSize: 14, resize: "vertical" }} />
              <Btn bg="#0f6e56" color="#fff">Submit Check-in</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function LocationAssignment() {
  const [selJob, setSelJob] = useState("");
  const [assigned, setAssigned] = useState({});
  const job = JOBS.find(j => j.id === selJob);
  const nearestCleaner = job ? CLEANERS.find(c => c.location === job.location) : null;
  return (
    <div>
      <SectionTitle>Location-Based Job Assignment</SectionTitle>
      <Card>
        <Select value={selJob} onChange={setSelJob} options={JOBS.map(j => ({ value: j.id, label: `${j.id} — ${j.status}` }))} placeholder="Select Job" />
        {job && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Job ID" value={job.id} />
            <FieldRow label="Location" value={job.location} />
            <FieldRow label="Status" value={<Badge status={job.status} />} />
            <FieldRow label="Nearest Cleaner" value={nearestCleaner ? nearestCleaner.name : "None available"} />
            {assigned[job.id] ? (
              <div style={{ marginTop: 10 }}><Badge status="Scheduled" /> Assigned to {assigned[job.id]}</div>
            ) : (
              <Btn bg="#185fa5" color="#fff" onClick={() => nearestCleaner && setAssigned(a => ({ ...a, [job.id]: nearestCleaner.name }))} style={{ marginTop: 10 }}>
                Assign Nearest Cleaner
              </Btn>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function RegularPayTransfer({ currency, taxRate }) {
  const [selEmp, setSelEmp] = useState("");
  const [adjustAmounts, setAdjustAmounts] = useState({});
  const [transferred, setTransferred] = useState({});
  const emp = CLEANERS.find(c => c.id === selEmp);
  const adjust = adjustAmounts[selEmp] ?? 0;
  const sym = currency.split(" ")[2]?.replace(/[()]/g, "") || "€";
  const gross = emp ? (emp.basePay + parseFloat(adjust || 0)) : 0;
  const tax = gross * (taxRate / 100);
  const net = gross - tax;
  return (
    <div>
      <SectionTitle>Regular Pay Transfer</SectionTitle>
      <Card>
        <Select value={selEmp} onChange={setSelEmp} options={CLEANERS.map(c => ({ value: c.id, label: c.name }))} placeholder="Select Employee" />
        {emp && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Employee ID" value={emp.id} />
            <FieldRow label="Name" value={emp.name} />
            <FieldRow label="Jobs Completed" value={emp.jobsDone} />
            <FieldRow label="Base Amount" value={`${sym}${emp.basePay.toFixed(2)}`} />
            <div style={{ padding: "8px 0", borderBottom: "1px solid #f5f4ef" }}>
              <label style={{ fontSize: 12, color: "#888780", display: "block", marginBottom: 4 }}>Adjust Amount</label>
              <input type="number" value={adjust} step="0.01"
                onChange={e => {
                  const v = e.target.value;
                  setAdjustAmounts(a => ({ ...a, [selEmp]: v === "" ? "" : parseFloat(v) || 0 }));
                }}
                style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #d0cfc7", fontSize: 14 }} />
            </div>
            <FieldRow label={`Tax (${taxRate}%)`} value={`-${sym}${tax.toFixed(2)}`} />
            <FieldRow label="Net Transfer" value={<strong>{sym}{net.toFixed(2)}</strong>} />
            {transferred[selEmp] ? (
              <div style={{ marginTop: 10, color: "#0f6e56", fontWeight: 600, fontSize: 13 }}><CheckCircle size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Transfer sent</div>
            ) : (
              <Btn bg="#0f6e56" color="#fff" onClick={() => setTransferred(t => ({ ...t, [selEmp]: true }))}>
                <Send size={13} style={{ marginRight: 4, verticalAlign: -2 }} />Transfer {sym}{net.toFixed(2)}
              </Btn>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function CleanerDashboard() {
  const [selJob, setSelJob] = useState("");
  const [selClient, setSelClient] = useState("");
  const myJobs = JOBS.filter(j => j.cleanerId === "E001");
  const job = myJobs.find(j => j.id === selJob);
  const client = job ? CLIENTS.find(c => c.id === selClient) : null;
  return (
    <div>
      <SectionTitle>My Assigned Jobs</SectionTitle>
      <Card>
        <Select value={selJob} onChange={v => { setSelJob(v); setSelClient(""); }} options={myJobs.map(j => ({ value: j.id, label: `${j.id} — ${j.date}` }))} placeholder="Select Job ID" />
        {job && (
          <div style={{ marginTop: 12 }}>
            <FieldRow label="Date" value={job.date} />
            <FieldRow label="Status" value={<Badge status={job.status} />} />
            <FieldRow label="Location" value={job.location} />
            <div style={{ marginTop: 10 }}>
              <Select value={selClient} onChange={setSelClient} options={CLIENTS.filter(c => c.id === job.clientId).map(c => ({ value: c.id, label: c.name }))} placeholder="Select Client" />
              {client && (
                <div style={{ marginTop: 10 }}>
                  <FieldRow label="Address" value={client.address} />
                  <FieldRow label="Phone" value={client.phone} />
                  <Btn bg="#e6f1fb" color="#185fa5"><MessageSquare size={13} style={{ marginRight: 4, verticalAlign: -2 }} />Message Client</Btn>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function AdminSettings({ currency, setCurrency, taxRate, setTaxRate }) {
  const [saved, setSaved] = useState(false);
  const save = () => {
    try { localStorage.setItem("agency_currency", currency); localStorage.setItem("agency_taxrate", taxRate); } catch {}
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div>
      <SectionTitle>Admin Settings</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "#888780", display: "block", marginBottom: 6 }}>Currency</label>
          <Select value={currency} onChange={setCurrency} options={CURRENCIES} placeholder="Select Currency" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: "#888780", display: "block", marginBottom: 6 }}>Tax Rate (%)</label>
          <input type="number" min="0" max="100" step="0.5" value={taxRate}
            onChange={e => {
              const v = parseFloat(e.target.value);
              if (isNaN(v)) setTaxRate(0);
              else setTaxRate(Math.min(100, Math.max(0, v)));
            }}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #d0cfc7", fontSize: 14 }} />
        </div>
        <Btn bg="#2c2c2a" color="#fff" onClick={save}>{saved ? "✓ Saved" : "Save Settings"}</Btn>
      </Card>

      <Card>
        <SectionTitle>Platform Features</SectionTitle>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0" }}>
          <CheckCircle size={22} color="#0f6e56" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#2c2c2a" }}>Unlimited Clients & Employees</div>
            <div style={{ fontSize: 13, color: "#888780", marginTop: 3 }}>Register unlimited clients and employees with no restrictions. Suitable for any agency size.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, role: "admin" },
  { id: "jobs", label: "Job Schedule", icon: Calendar, role: "admin" },
  { id: "client-invoices", label: "Client Invoices", icon: FileText, role: "admin" },
  { id: "cleaner-invoices", label: "Cleaner Invoices", icon: FileText, role: "admin" },
  { id: "checkin", label: "Manual Check-in", icon: UserCheck, role: "admin" },
  { id: "assignment", label: "Job Assignment", icon: MapPin, role: "admin" },
  { id: "pay", label: "Pay Transfer", icon: DollarSign, role: "admin" },
  { id: "settings", label: "Settings", icon: Settings, role: "admin" },
  { id: "my-jobs", label: "My Jobs", icon: ClipboardList, role: "cleaner" },
];

function Dashboard({ currency, taxRate }) {
  const sym = currency.split(" ")[2]?.replace(/[()]/g, "") || "€";
  const stats = [
    { label: "Total Jobs", value: JOBS.length, color: "#e6f1fb", text: "#185fa5" },
    { label: "Clients", value: CLIENTS.length, color: "#e1f5ee", text: "#0f6e56" },
    { label: "Cleaners", value: CLEANERS.length, color: "#faeeda", text: "#ba7517" },
    { label: "Pending Invoices", value: CLIENT_INVOICES.filter(i => i.status === "Pending").length, color: "#fbeaf0", text: "#993556" },
  ];
  return (
    <div>
      <SectionTitle>Dashboard Overview</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: s.color, borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: s.text, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.text }}>{s.value}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 13, color: "#888780", marginBottom: 8 }}>Recent Jobs</div>
        {JOBS.slice(0, 3).map(j => {
          const client = CLIENTS.find(c => c.id === j.clientId);
          return (
            <div key={j.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f4ef", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 500 }}>{j.id}</div>
                <div style={{ fontSize: 12, color: "#888780" }}>{client?.name} · {j.date}</div>
              </div>
              <Badge status={j.status} />
            </div>
          );
        })}
      </Card>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState("login");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [currency, setCurrency] = useState(() => { try { return localStorage.getItem("agency_currency") || "EUR - Euro (€)"; } catch { return "EUR - Euro (€)"; } });
  const [taxRate, setTaxRate] = useState(() => { try { return parseFloat(localStorage.getItem("agency_taxrate")) || 20; } catch { return 20; } });

  if (role === "login") return <Login onLogin={setRole} />;

  const navItems = NAV.filter(n => n.role === role || n.role === "all");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f8f7f3" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#1a1a18", flexShrink: 0, display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #2c2c2a" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>CleanPro</div>
          <div style={{ fontSize: 12, color: "#888780", marginTop: 2 }}>{role === "admin" ? "Admin Portal" : "Cleaner Portal"}</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => setActiveNav(item.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 20px", background: active ? "#2c2c2a" : "transparent", border: "none", color: active ? "#fff" : "#888780", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", textAlign: "left" }}>
                <Icon size={16} />{item.label}
              </button>
            );
          })}
        </nav>
        <button onClick={() => setRole("login")}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", background: "transparent", border: "none", color: "#888780", fontSize: 13, cursor: "pointer" }}>
          <LogOut size={16} />Sign Out
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a18" }}>
              {NAV.find(n => n.id === activeNav)?.label}
            </h2>
          </div>
          {activeNav === "dashboard" && <Dashboard currency={currency} taxRate={taxRate} />}
          {activeNav === "jobs" && <JobSchedule />}
          {activeNav === "client-invoices" && <ClientInvoices />}
          {activeNav === "cleaner-invoices" && <CleanerInvoices />}
          {activeNav === "checkin" && <ManualCheckin />}
          {activeNav === "assignment" && <LocationAssignment />}
          {activeNav === "pay" && <RegularPayTransfer currency={currency} taxRate={taxRate} />}
          {activeNav === "settings" && <AdminSettings currency={currency} setCurrency={setCurrency} taxRate={taxRate} setTaxRate={setTaxRate} />}
          {activeNav === "my-jobs" && <CleanerDashboard />}
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [sel, setSel] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f3", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e7e0", padding: "40px 36px", width: 340, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🧹</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a18" }}>CleanPro</h1>
        <p style={{ fontSize: 13, color: "#888780", margin: "0 0 28px" }}>Cleaning Agency Admin Portal</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => onLogin("admin")} style={{ padding: "12px", borderRadius: 10, border: "none", background: "#1a1a18", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign in as Admin</button>
          <button onClick={() => onLogin("cleaner")} style={{ padding: "12px", borderRadius: 10, border: "1px solid #d0cfc7", background: "#fff", color: "#2c2c2a", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign in as Cleaner</button>
        </div>
      </div>
    </div>
  );
}
