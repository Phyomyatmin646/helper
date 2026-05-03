import { useState, useRef } from "react";
import Button from "../../components/ui/Button";

const INITIAL_HELPERS = [
  {
    id: 1,
    name: "Amara Okafor",
    role: "Housekeeping",
    age: 32,
    gender: "Female",
    experience: "5 Years",
    status: "Active",
    color: "#e0e7ff",
    textColor: "#3730a3",
  },
  {
    id: 2,
    name: "Sanjay Patel",
    role: "Security",
    age: 45,
    gender: "Male",
    experience: "12 Years",
    status: "On Leave",
    color: "#e0f2fe",
    textColor: "#0369a1",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Gardening",
    age: 29,
    gender: "Female",
    experience: "3 Years",
    status: "Active",
    color: "#fce7f3",
    textColor: "#9d174d",
  },
  {
    id: 4,
    name: "Marcus Chen",
    role: "Maintenance",
    age: 38,
    gender: "Male",
    experience: "8 Years",
    status: "Inactive",
    color: "#fef3c7",
    textColor: "#92400e",
  },
];

const STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  "On Leave": "bg-yellow-100 text-yellow-700",
};

const AVATAR_COLORS = [
  { color: "#e0e7ff", textColor: "#3730a3" },
  { color: "#e0f2fe", textColor: "#0369a1" },
  { color: "#fce7f3", textColor: "#9d174d" },
  { color: "#fef3c7", textColor: "#92400e" },
  { color: "#d1fae5", textColor: "#065f46" },
  { color: "#ede9fe", textColor: "#5b21b6" },
];

const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const EMPTY_FORM = {
  name: "",
  age: "",
  gender: "Male",
  experience: "",
  designation: "Housekeeping",
  phone: "",
  address: "",
  nrc: "",
};

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-gray-200" />
    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
      {label}
    </span>
    <div className="flex-1 h-px bg-gray-200" />
  </div>
);

const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors";

const PhotoUpload = ({ label, preview, onFile, icon, hint, circle }) => {
  const ref = useRef();
  return (
    <FormField label={label}>
      <div
        onClick={() => ref.current.click()}
        className={`
          cursor-pointer border-2 border-dashed transition-all overflow-hidden
          ${circle ? "w-24 h-24 rounded-full mx-auto flex items-center justify-center" : "rounded-xl p-5 text-center"}
          ${preview ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"}
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className={
              circle
                ? "w-full h-full object-cover"
                : "max-h-28 mx-auto rounded-lg object-contain"
            }
          />
        ) : (
          <div className={circle ? "text-center" : ""}>
            <div className="text-3xl mb-1">{icon}</div>
            {!circle && (
              <>
                <p className="text-sm font-semibold text-gray-500">
                  Click to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">{hint}</p>
              </>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>
      {circle && (
        <p className="text-xs text-gray-400 text-center mt-1">{hint}</p>
      )}
    </FormField>
  );
};

export default function HelpersPage() {
  const [helpers, setHelpers] = useState(INITIAL_HELPERS);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    role: "",
    gender: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [helperPhoto, setHelperPhoto] = useState(null);
  const [nrcFront, setNrcFront] = useState(null);
  const [nrcBack, setNrcBack] = useState(null);

  const activeFilters = Object.entries(filters).filter(([, v]) => v !== "");

  const filteredHelpers = helpers.filter((h) => {
    const matchSearch =
      !filters.search ||
      h.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = !filters.status || h.status === filters.status;
    const matchRole = !filters.role || h.role === filters.role;
    const matchGender = !filters.gender || h.gender === filters.gender;
    return matchSearch && matchStatus && matchRole && matchGender;
  });

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const removeFilter = (key) => setFilter(key, "");

  const resetFilters = () =>
    setFilters({ search: "", status: "", role: "", gender: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const readFile = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const colorSet = AVATAR_COLORS[helpers.length % AVATAR_COLORS.length];
    setHelpers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        role: form.designation,
        age: form.age || "—",
        gender: form.gender,
        experience: form.experience ? `${form.experience} Years` : "—",
        status: "Active",
        ...colorSet,
      },
    ]);
    setForm(EMPTY_FORM);
    setHelperPhoto(null);
    setNrcFront(null);
    setNrcBack(null);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setHelperPhoto(null);
    setNrcFront(null);
    setNrcBack(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Helpers Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Efficiently manage staff, view status updates, and register new
          household helpers for the villa complex.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-3">
          <h2 className="font-bold text-gray-900">Registered Helpers</h2>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={showFilter ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowFilter((v) => !v)}
            >
              ⚙ Filter
              {activeFilters.length > 0 && (
                <span className="ml-1 bg-white text-blue-700 rounded-full px-1.5 text-xs font-bold">
                  {activeFilters.length}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              + Add New Helper
            </Button>
          </div>
        </div>

        {showFilter && (
          <div className="flex flex-wrap gap-3 items-end px-5 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Search Name
              </label>
              <input
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                placeholder="Type a name..."
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400 w-44"
              />
            </div>

            {[
              {
                key: "status",
                label: "Status",
                options: ["Active", "On Leave", "Inactive"],
              },
              {
                key: "role",
                label: "Designation",
                options: [
                  "Housekeeping",
                  "Security",
                  "Gardening",
                  "Maintenance",
                ],
              },
              {
                key: "gender",
                label: "Gender",
                options: ["Male", "Female"],
              },
            ].map(({ key, label, options }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {label}
                </label>
                <select
                  value={filters[key]}
                  onChange={(e) => setFilter(key, e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400 min-w-[140px]"
                >
                  <option value="">All {label}s</option>
                  {options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}

            {activeFilters.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors"
              >
                ✕ Reset All
              </button>
            )}
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 py-2.5 border-b border-gray-100 bg-white">
            {activeFilters.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full"
              >
                <span className="capitalize">{key}</span>: {value}
                <button
                  onClick={() => removeFilter(key)}
                  className="text-indigo-300 hover:text-indigo-600 text-sm leading-none ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Name", "Age", "Gender", "Experience", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredHelpers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-14 text-gray-400 text-sm"
                >
                  <div className="text-3xl mb-2">🔍</div>
                  No helpers match the selected filters.
                </td>
              </tr>
            ) : (
              filteredHelpers.map((helper) => (
                <tr
                  key={helper.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0"
                        style={{
                          background: helper.color,
                          color: helper.textColor,
                        }}
                      >
                        {initials(helper.name)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">
                          {helper.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {helper.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {helper.age}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {helper.gender}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {helper.experience}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[helper.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {helper.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-blue-600 text-sm font-semibold hover:underline">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Total Staff
          </div>
          <div className="text-4xl font-black text-gray-900 mt-1">
            {helpers.length + 120}
          </div>
          <div className="text-xs text-gray-400 mt-1">+4 from last month</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Currently on Duty
          </div>
          <div className="text-4xl font-black text-gray-900 mt-1">98</div>
          <div className="text-xs text-green-600 mt-1">79% Occupancy</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">
            On Leave
          </div>
          <div className="text-4xl font-black text-red-600 mt-1">12</div>
          <div className="text-xs text-red-400 mt-1">8 Returning this week</div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto">
            <div className="flex justify-between items-start px-8 pt-7 pb-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Helper
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Onboard a new staff member to the Villa management system.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-300 hover:text-gray-600 text-2xl leading-none ml-4 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="px-8 pb-8 space-y-0">
              <SectionDivider label="Helper Photo" />
              <PhotoUpload
                label="Profile Photo"
                preview={helperPhoto}
                onFile={(e) => readFile(e, setHelperPhoto)}
                icon="👤"
                hint="Clear face photo · JPG, PNG up to 5MB"
                circle
              />

              <SectionDivider label="Personal Details" />
              <div className="space-y-4">
                <FormField label="Full Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={inputCls}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Age">
                    <input
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="30"
                      type="number"
                      min="18"
                      max="80"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Gender">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </FormField>
                </div>
              </div>

              <SectionDivider label="Contact Details" />
              <div className="space-y-4">
                <FormField label="Phone Number">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+260 97X XXX XXX"
                    type="tel"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Address">
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, Area, City"
                    className={inputCls}
                  />
                </FormField>
              </div>

              {/* ── Employment Details ── */}
              <SectionDivider label="Employment" />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Experience (Years)">
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="5"
                    type="number"
                    min="0"
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Designation">
                  <select
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option>Housekeeping</option>
                    <option>Security</option>
                    <option>Gardening</option>
                    <option>Maintenance</option>
                    <option>Other</option>
                  </select>
                </FormField>
              </div>

              <SectionDivider label="Identity Documents" />
              <div className="space-y-4">
                <FormField label="NRC Number (National ID)">
                  <input
                    name="nrc"
                    value={form.nrc}
                    onChange={handleChange}
                    placeholder="XX/XXXXXX/XX/X"
                    className={inputCls}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <PhotoUpload
                    label="NRC Front"
                    preview={nrcFront}
                    onFile={(e) => readFile(e, setNrcFront)}
                    icon="🪪"
                    hint="Front side · JPG, PNG"
                  />
                  <PhotoUpload
                    label="NRC Back"
                    preview={nrcBack}
                    onFile={(e) => readFile(e, setNrcBack)}
                    icon="🪪"
                    hint="Back side · JPG, PNG"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!form.name.trim()}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  Complete Onboarding
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  By onboarding, you agree to the Villa Service Agreement and
                  privacy policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
