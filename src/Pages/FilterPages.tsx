import { useLoaderData, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';

// Types
interface Province {
  id: number;
  name: string;
}

interface Regency {
  id: number;
  name: string;
  province_id: number;
}

interface District {
  id: number;
  name: string;
  regency_id: number;
}

interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}

// Loader Data
export async function regionLoader(): Promise<RegionData> {
  const response = await fetch('/data/indonesia_regions.json');
  if (!response.ok) throw new Error('Failed to fetch region data');
  return response.json();
}

// Reusable Components
interface SelectOption {
  id: number;
  name: string;
}

interface RegionSelectProps {
  id: string;
  name: string;
  label: string;
  icon: ReactNode;
  value: string;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function RegionSelect({
  id,
  name,
  label,
  icon,
  value,
  options,
  placeholder,
  disabled = false,
  onChange,
}: RegionSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.65rem] font-semibold tracking-wide text-navy/70 uppercase"
      >
        {label}
      </label>
      <div className="select-wrapper">
        <span className="select-icon" aria-hidden="true">
          {icon}
        </span>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-label={label}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <span className="chevron-icon" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}

// Select Icons
const PROVINCE_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const REGENCY_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DISTRICT_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="10" r="3" />
    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
  </svg>
);

// Main Page Component
export default function FilterPages() {
  const data = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();

  const provinceId = searchParams.get('province');
  const regencyId = searchParams.get('regency');
  const districtId = searchParams.get('district');

  // Derived data
  const selectedProvince = data.provinces.find(
    (p) => String(p.id) === provinceId
  );
  const filteredRegencies = selectedProvince
    ? data.regencies.filter((r) => r.province_id === selectedProvince.id)
    : [];
  const selectedRegency = filteredRegencies.find(
    (r) => String(r.id) === regencyId
  );
  const filteredDistricts = selectedRegency
    ? data.districts.filter((d) => d.regency_id === selectedRegency.id)
    : [];
  const selectedDistrict = filteredDistricts.find(
    (d) => String(d.id) === districtId
  );

  // Handlers
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchParams(value ? { province: value } : {});
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (provinceId) {
      setSearchParams(
        value
          ? { province: provinceId, regency: value }
          : { province: provinceId }
      );
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (provinceId && regencyId) {
      setSearchParams(
        value
          ? { province: provinceId, regency: regencyId, district: value }
          : { province: provinceId, regency: regencyId }
      );
    }
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="flex min-h-screen font-sans bg-main-bg text-navy">
      {/* Skip to main content (A11y + SEO) */}
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
      </a>

      {/* Sidebar */}
      <aside className="w-64 min-w-64 p-6 flex flex-col gap-6 bg-sidebar-bg border-r border-gray-200/60">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <span className="font-bold text-sm text-navy tracking-tight">
            Frontend Assessment
          </span>
        </div>

        {/* Filter Section */}
        <div
          className="flex flex-col gap-5"
          role="group"
          aria-label="Filter Wilayah"
        >
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-label uppercase">
            Filter Wilayah
          </span>

          <RegionSelect
            id="select-province"
            name="province"
            label="Provinsi"
            icon={PROVINCE_ICON}
            value={provinceId ?? ''}
            options={data.provinces}
            placeholder="Pilih Provinsi"
            onChange={handleProvinceChange}
          />

          <RegionSelect
            id="select-regency"
            name="regency"
            label="Kota/Kabupaten"
            icon={REGENCY_ICON}
            value={regencyId ?? ''}
            options={filteredRegencies}
            placeholder="Pilih Kota/Kabupaten"
            disabled={!selectedProvince}
            onChange={handleRegencyChange}
          />

          <RegionSelect
            id="select-district"
            name="district"
            label="Kecamatan"
            icon={DISTRICT_ICON}
            value={districtId ?? ''}
            options={filteredDistricts}
            placeholder="Pilih Kecamatan"
            disabled={!selectedRegency}
            onChange={handleDistrictChange}
          />
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border-1.5 border-gray-300 rounded-xl text-sm font-medium text-navy/80 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          RESET
        </button>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <nav className="breadcrumb px-8 py-5" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm">
            <li
              className={
                selectedProvince
                  ? 'text-navy/50 font-medium'
                  : 'text-accent font-semibold'
              }
            >
              Indonesia
            </li>
            {selectedProvince && (
              <>
                <li className="text-navy/30" aria-hidden="true">
                  ›
                </li>
                <li
                  className={
                    selectedRegency
                      ? 'text-navy/50 font-medium'
                      : 'text-accent font-semibold'
                  }
                >
                  {selectedProvince.name}
                </li>
              </>
            )}
            {selectedRegency && (
              <>
                <li className="text-navy/30" aria-hidden="true">
                  ›
                </li>
                <li
                  className={
                    selectedDistrict
                      ? 'text-navy/50 font-medium'
                      : 'text-accent font-semibold'
                  }
                >
                  {selectedRegency.name}
                </li>
              </>
            )}
            {selectedDistrict && (
              <>
                <li className="text-navy/30" aria-hidden="true">
                  ›
                </li>
                <li className="text-accent font-semibold">
                  {selectedDistrict.name}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Region Hierarchy Display */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 -mt-8">
          {/* Initial state — no filter selected */}
          {!selectedProvince && (
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                Wilayah
              </span>
              <h1 className="text-5xl font-extrabold text-navy mt-2 tracking-tight">
                Indonesia
              </h1>
            </div>
          )}

          {/* Provinsi */}
          {selectedProvince && (
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                Provinsi
              </span>
              <h1 className="text-5xl font-extrabold text-navy mt-2 tracking-tight">
                {selectedProvince.name}
              </h1>
            </div>
          )}

          {/* Kota/Kabupaten */}
          {selectedRegency && (
            <>
              <div className="text-navy/25 my-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  Kota / Kabupaten
                </span>
                <h2 className="text-4xl font-extrabold text-navy mt-2 tracking-tight">
                  {selectedRegency.name}
                </h2>
              </div>
            </>
          )}

          {/* Kecamatan */}
          {selectedDistrict && (
            <>
              <div className="text-navy/25 my-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  Kecamatan
                </span>
                <h3 className="text-3xl font-extrabold text-navy mt-2 tracking-tight">
                  {selectedDistrict.name}
                </h3>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// By Zikkri Amri
// Github : Aguira1908
