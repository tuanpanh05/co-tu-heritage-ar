import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { speechService } from '../../services/speechService';
import {
  Compass,
  Volume2,
  ArrowRight,
  Trees,
  Sparkles,
  Layers
} from 'lucide-react';

interface SpatialZone {
  id: string;
  code: string;
  title: { vi: string; en: string };
  subtitle: { vi: string; en: string };
  termEn: string;
  ipa: string;
  academicAnalysis: { vi: string; en: string };
  ecologicalRole: { vi: string; en: string };
  relatedSlug: string;
  relatedArtifactName: { vi: string; en: string };
  badgeColor: string;
}

const VILLAGE_SPATIAL_ZONES: SpatialZone[] = [
  {
    id: 'zone-center',
    code: 'I',
    title: {
      vi: 'Tâm Điểm Vũ Trụ: Cột Tế Lễ T’kơơr (Xơ-nur)',
      en: 'Cosmic Center: T’kơơr Ceremonial Pole (Axis Mundi)'
    },
    subtitle: {
      vi: 'Trục thiêng kết nối Đất – Người – Thần linh (Giàng)',
      en: 'The vertical sacred axis linking Earth, Humanity, and Deities'
    },
    termEn: 'Concentric ritual courtyard & Axis Mundi',
    ipa: '/kənˈsen.trɪk ˈrɪtʃ.u.əl ˈkɔːt.jɑːd/',
    academicAnalysis: {
      vi: 'Theo nhân học không gian, người Cơ Tu quy hoạch bản làng theo mô hình đồng tâm. Chính giữa sân làng là Cột tế T’kơơr chạm khắc đôi cánh chim Kơ-lang, đóng vai trò tâm điểm hình học và tâm linh nơi hội tụ sinh khí của cả cộng đồng.',
      en: 'In spatial anthropology, Cơ Tu villages follow a concentric cosmology. At the exact geometric center stands the carved T’kơơr pole, functioning as the Axis Mundi where communal vitality converges.'
    },
    ecologicalRole: {
      vi: 'Không gian mở trung tâm giúp điều hòa gió núi và ánh sáng tự nhiên cho toàn bộ các nếp nhà xung quanh.',
      en: 'The open central plaza facilitates mountain air circulation and natural sunlight across the settlement.'
    },
    relatedSlug: 'tkoor-sacrifice-pillar',
    relatedArtifactName: { vi: 'Cột Tế T’kơơr 3D', en: '3D T’kơơr Ceremonial Pole' },
    badgeColor: 'bg-amber-400 text-slate-950'
  },
  {
    id: 'zone-guol',
    code: 'II',
    title: {
      vi: 'Trái Tim Cộng Đồng: Nhà Gươl Truyền Thống',
      en: 'Communal Sanctuary: The Sacred Gươl House'
    },
    subtitle: {
      vi: 'Trung tâm nghị sự, xét xử luật tục và lưu giữ báu vật làng',
      en: 'Council hall, customary court, and repository of village heirlooms'
    },
    termEn: 'Sacred communal architecture (Gươl)',
    ipa: '/ˈseɪ.krɪd kəˈmjuː.nəl ˈɑː.kɪ.tek.tʃər/',
    academicAnalysis: {
      vi: 'Tọa lạc ở thế đất cao và trang trọng nhất nhìn ra cột tế T’kơơr, Nhà Gươl có mái hình nón vươn cao chống đỡ bởi cột cái Ki’lơm. Đây là thiết chế xã hội tự quản giúp duy trì luật tục và gắn kết các dòng họ.',
      en: 'Positioned on the most elevated ground facing the T’kơơr pole, the soaring conical Gươl house serves as the self-governing civic and spiritual institution uniting all clans.'
    },
    ecologicalRole: {
      vi: 'Sử dụng 100% vật liệu tái tạo tại chỗ (gỗ rừng có chọn lọc, lá mây, tre nứa) với kết cấu mộng gỗ không đinh.',
      en: 'Built entirely from renewable forest materials using nail-free mortise-and-tenon joinery.'
    },
    relatedSlug: 'guol-communal-house',
    relatedArtifactName: { vi: 'Nhà Gươl Truyền Thống 3D', en: '3D Gươl Communal House' },
    badgeColor: 'bg-emerald-400 text-slate-950'
  },
  {
    id: 'zone-courtyard',
    code: 'III',
    title: {
      vi: 'Vòng Sân Hội: Không Gian Trống K’tu, Đàn T’rứt & Vũ Điệu',
      en: 'Festival Ring: K’tu Drum, T’rứt Fiddle & Ritual Dance'
    },
    subtitle: {
      vi: 'Vòng tròn âm thanh đa âm và điệu múa Tân Tung Da Dă',
      en: 'Polyrhythmic soundscape and collective counterclockwise dance'
    },
    termEn: 'Counterclockwise ritual dance circle',
    ipa: '/ˌkaʊn.təˈklɒk.waɪz ˈrɪtʃ.u.əl dɑːns/',
    academicAnalysis: {
      vi: 'Vòng sân rộng quanh cột T’kơơr là nơi diễn ra điệu múa Tân Tung Da Dă di chuyển ngược chiều kim đồng hồ (thuận theo chu kỳ vận hành của vũ trụ), dẫn nhịp bởi tiếng trống K’tu trầm hùng và tiếng đàn T’rứt.',
      en: 'Around the central pole, villagers perform the Tân Tung Da Dă dance moving counterclockwise in harmony with cosmic cycles, driven by the resonant K’tu drum and T’rứt fiddle.'
    },
    ecologicalRole: {
      vi: 'Mặt sân đất nện tự nhiên thấm thoát nước mưa tốt, không bê tông hóa gây bức xạ nhiệt.',
      en: 'Permeable compacted-earth courtyard prevents runoff erosion and avoids thermal heat islands.'
    },
    relatedSlug: 'ktu-traditional-drum',
    relatedArtifactName: { vi: 'Trống K’tu Truyền Thống 3D', en: '3D Traditional K’tu Drum' },
    badgeColor: 'bg-teal-300 text-slate-950'
  },
  {
    id: 'zone-residential',
    code: 'IV',
    title: {
      vi: 'Vành Đai Nhà Sàn & Hiên Đan Gùi, Dệt Thổ Cẩm',
      en: 'Residential Stilt Ring & Artisanal Craft Porches'
    },
    subtitle: {
      vi: 'Các ngôi nhà sàn xếp hình elip hướng cửa về phía Nhà Gươl',
      en: 'Family stilt houses arranged in an protective ellipse facing the Gươl'
    },
    termEn: 'Circular village layout & craft porch',
    ipa: '/ˈsɜː.kjə.lər ˈvɪl.ɪdʒ ˈleɪ.aʊt/',
    academicAnalysis: {
      vi: 'Tất cả nhà ở của các hộ gia đình đều xoay mặt vào tâm làng, tạo nên không gian phòng thủ cộng đồng và bình đẳng xã hội. Dưới hiên nhà là không gian truyền nghề đan gùi Ba-hiêng và dệt thổ cẩm cườm chì.',
      en: 'All family stilt homes face inward toward the Gươl, fostering egalitarian solidarity and collective defense while serving as open-air workshops for Ba-hiêng basketry and brocade weaving.'
    },
    ecologicalRole: {
      vi: 'Nhà sàn cách đất giúp bảo vệ địa hình tự nhiên, tránh san ủi làm đứt gãy mạch nước ngầm sườn núi.',
      en: 'Stilt foundations preserve natural mountain contours without destructive earth-leveling.'
    },
    relatedSlug: 'bahieng-carrying-basket',
    relatedArtifactName: { vi: 'Gùi Ba-hiêng Cơ Tu 3D', en: '3D Ba-hiêng Woven Basket' },
    badgeColor: 'bg-orange-300 text-slate-950'
  },
  {
    id: 'zone-forest',
    code: 'V',
    title: {
      vi: 'Vành Đai Rừng Thiêng Pơ-mu & Đỗ Quyên Đầu Nguồn',
      en: 'Outer Ecological Shield: Sacred Pơ-mu Watershed Forest'
    },
    subtitle: {
      vi: 'Lá chắn sinh thái được bảo vệ nghiêm ngặt bởi Luật tục Cơ Tu',
      en: 'Old-growth biodiversity buffer strictly governed by Customary Law'
    },
    termEn: 'Sacred watershed forest stewardship',
    ipa: '/ˈseɪ.krɪd ˈwɔː.tə.ʃed ˈfɒr.ɪst/',
    academicAnalysis: {
      vi: 'Bao bọc bên ngoài bản làng là khu rừng cấm / rừng thiêng đầu nguồn (rừng Pơ-mu, Đỗ quyên cổ thụ). Luật tục Cơ Tu nghiêm cấm xâm phạm rừng đầu nguồn, tạo nên mô hình sinh thái nhân văn bền vững hàng trăm năm.',
      en: 'Surrounding the village is the sacred watershed forest. Indigenous customary law strictly prohibits logging in these old-growth Pơ-mu groves, sustaining water sources for centuries.'
    },
    ecologicalRole: {
      vi: 'Giữ nước mạch ngầm, điều hòa vi khí hậu sương mù và cung cấp mây tre, dược liệu Ba Kích bền vững.',
      en: 'Protects mountain aquifers, regulates misty microclimates, and sustainably supplies rattan and medicinal herbs.'
    },
    relatedSlug: 'trut-traditional-instrument',
    relatedArtifactName: { vi: 'Đàn T’rứt Dân Gian 3D', en: '3D T’rứt Folk Instrument' },
    badgeColor: 'bg-lime-300 text-slate-950'
  }
];

export const InteractiveVillageMap: React.FC = () => {
  const { t } = useLanguage();
  const [activeZoneId, setActiveZoneId] = useState<string>('zone-center');

  const activeZone =
    VILLAGE_SPATIAL_ZONES.find((z) => z.id === activeZoneId) || VILLAGE_SPATIAL_ZONES[0];

  const handleSelectZone = (zone: SpatialZone) => {
    setActiveZoneId(zone.id);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="soft-glass-card rounded-2xl p-6 sm:p-10 border border-[#23352C] shadow-heritage space-y-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#23352C] pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#14221A] border border-heritage-ochre/30 text-heritage-ochre text-xs font-mono uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>
                {t(
                  'Nghiên cứu Nhân học Không gian & Sinh thái Bản làng',
                  'Spatial Anthropology & Village Ecology'
                )}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-heritage-wood">
              {t(
                'Sơ Đồ Vũ Trụ Quan & Cấu Trúc Làng Tròn Cơ Tu Tây Giang',
                'Cosmological & Spatial Map of a Traditional Cơ Tu Circular Village'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodLight/80 leading-relaxed">
              {t(
                'Chạm vào từng vòng không gian trên sơ đồ bản làng bên dưới để khám phá mối liên hệ hữu cơ giữa Rừng thiêng – Bản làng – Nhà Gươl – Cột tế T’kơơr và các hiện vật 3D.',
                'Click any concentric ring on the interactive village diagram below to explore the organic relationship between the Sacred Forest, Stilt Homes, Gươl House, and T’kơơr Pole.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-heritage-ochre bg-[#14221A] px-3.5 py-1.5 rounded-lg border border-heritage-ochre/30 shrink-0 self-start lg:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-heritage-ochre" />
            <span>{t('Mô hình Làng cổ Pơr’ning · 5 Lớp không gian', 'Pơr’ning Village Model · 5 Spatial Rings')}</span>
          </div>
        </div>

        {/* Main Interactive Grid: Left SVG Diagram + Right Academic Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: Interactive Concentric Village SVG Map */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[440px] aspect-square forest-stage-dark rounded-3xl p-4 sm:p-6 flex items-center justify-center shadow-xl overflow-hidden">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full select-none"
                role="img"
                aria-label="Interactive Cơ Tu Circular Village Map"
              >
                <defs>
                  <radialGradient id="forestRingGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="65%" stopColor="#13382B" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#091E16" stopOpacity="0.98" />
                  </radialGradient>
                </defs>

                {/* RING V: Outer Sacred Forest */}
                <g
                  onClick={() => handleSelectZone(VILLAGE_SPATIAL_ZONES[4])}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="186"
                    fill="url(#forestRingGrad)"
                    stroke={activeZoneId === 'zone-forest' ? '#A3E635' : '#2D6A54'}
                    strokeWidth={activeZoneId === 'zone-forest' ? '4' : '1.5'}
                    strokeDasharray="6 4"
                  />
                  {/* Stylized Pine / Pơ-mu trees around outer ring */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const tx = 200 + Math.cos(rad) * 166;
                    const ty = 200 + Math.sin(rad) * 166;
                    return (
                      <circle
                        key={deg}
                        cx={tx}
                        cy={ty}
                        r="8"
                        fill={activeZoneId === 'zone-forest' ? '#A3E635' : '#1F5642'}
                        opacity="0.85"
                      />
                    );
                  })}
                  <text
                    x="200"
                    y="32"
                    textAnchor="middle"
                    fill="#D9F99D"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    V. RỪNG THIÊNG PƠ-MU (WATERSHED FOREST)
                  </text>
                </g>

                {/* RING IV: Residential Stilt Houses Ellipse */}
                <g
                  onClick={() => handleSelectZone(VILLAGE_SPATIAL_ZONES[3])}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="138"
                    fill={activeZoneId === 'zone-residential' ? '#245946' : '#163D30'}
                    stroke={activeZoneId === 'zone-residential' ? '#FDBA74' : '#3B7A62'}
                    strokeWidth={activeZoneId === 'zone-residential' ? '3.5' : '1.5'}
                  />
                  {/* 8 Stilt Houses arranged in a circle facing inward */}
                  {[25, 65, 115, 155, 205, 245, 295, 335].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const hx = 200 + Math.cos(rad) * 116;
                    const hy = 200 + Math.sin(rad) * 116;
                    return (
                      <rect
                        key={deg}
                        x={hx - 9}
                        y={hy - 6}
                        width="18"
                        height="12"
                        rx="3"
                        fill={activeZoneId === 'zone-residential' ? '#FDBA74' : '#8BA89A'}
                        stroke="#0D261D"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  <text
                    x="200"
                    y="80"
                    textAnchor="middle"
                    fill="#FED7AA"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    IV. VÀNH ĐAI NHÀ SÀN & ĐAN LÁT
                  </text>
                </g>

                {/* RING III: Festival Courtyard & Dance Circle */}
                <g
                  onClick={() => handleSelectZone(VILLAGE_SPATIAL_ZONES[2])}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="92"
                    fill={activeZoneId === 'zone-courtyard' ? '#1E5E4A' : '#1B4939'}
                    stroke={activeZoneId === 'zone-courtyard' ? '#5EEAD4' : '#4E8E75'}
                    strokeWidth={activeZoneId === 'zone-courtyard' ? '3.5' : '1.5'}
                    strokeDasharray="4 3"
                  />
                  <text
                    x="200"
                    y="276"
                    textAnchor="middle"
                    fill="#99F6E4"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    III. SÂN HỘI TRỐNG K’TU & TÂN TUNG DA DĂ
                  </text>
                </g>

                {/* ZONE II: Sacred Gươl Communal House (Upper Center) */}
                <g
                  onClick={() => handleSelectZone(VILLAGE_SPATIAL_ZONES[1])}
                  className="cursor-pointer transition-all duration-300"
                >
                  <polygon
                    points="200,115 162,162 238,162"
                    fill={activeZoneId === 'zone-guol' ? '#34D399' : '#10B981'}
                    stroke="#ECFDF5"
                    strokeWidth={activeZoneId === 'zone-guol' ? '3' : '1.5'}
                  />
                  <rect
                    x="172"
                    y="162"
                    width="56"
                    height="18"
                    rx="3"
                    fill={activeZoneId === 'zone-guol' ? '#059669' : '#047857'}
                    stroke="#ECFDF5"
                    strokeWidth="1"
                  />
                  <text
                    x="200"
                    y="154"
                    textAnchor="middle"
                    fill="#06281E"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    II. NHÀ GƯƠL
                  </text>
                </g>

                {/* ZONE I: Exact Center - T'kơơr Ceremonial Pole */}
                <g
                  onClick={() => handleSelectZone(VILLAGE_SPATIAL_ZONES[0])}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle
                    cx="200"
                    cy="215"
                    r="26"
                    fill={activeZoneId === 'zone-center' ? '#FBBF24' : '#D97706'}
                    stroke="#FEF3C7"
                    strokeWidth={activeZoneId === 'zone-center' ? '3.5' : '1.5'}
                  />
                  {/* Winged Totem Icon inside Center */}
                  <line x1="184" y1="212" x2="216" y2="212" stroke="#1E293B" strokeWidth="3" />
                  <line x1="200" y1="198" x2="200" y2="232" stroke="#1E293B" strokeWidth="3.5" />
                  <text
                    x="200"
                    y="254"
                    textAnchor="middle"
                    fill="#FDE68A"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    I. CỘT TẾ T’KƠƠR
                  </text>
                </g>
              </svg>
            </div>

            {/* 5 Quick Selector Pills below SVG */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {VILLAGE_SPATIAL_ZONES.map((z) => {
                const isSelected = z.id === activeZoneId;
                return (
                  <button
                    key={z.id}
                    onClick={() => handleSelectZone(z)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-heritage-ochre text-slate-950 font-bold shadow-sm scale-105'
                        : 'bg-[#14221A] text-heritage-woodMuted hover:text-heritage-wood hover:bg-[#1A2C22] border border-[#23352C]'
                    }`}
                  >
                    <span className="font-mono font-bold">{z.code}.</span>
                    <span>
                      {t(
                        z.title.vi.split(':')[0],
                        z.title.en.split(':')[0]
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed Academic & Ecological Panel for Selected Zone */}
          <div className="lg:col-span-6 space-y-5">
            <div className="forest-stage-dark rounded-2xl p-6 sm:p-8 text-heritage-wood space-y-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <span
                    className={`inline-block px-3 py-0.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${activeZone.badgeColor}`}
                  >
                    {t(`Vùng không gian ${activeZone.code}`, `Spatial Ring ${activeZone.code}`)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood leading-snug">
                    {t(activeZone.title.vi, activeZone.title.en)}
                  </h3>
                  <p className="text-xs sm:text-sm text-heritage-ochre italic font-serif">
                    {t(activeZone.subtitle.vi, activeZone.subtitle.en)}
                  </p>
                </div>
              </div>

              {/* CLIL Academic Term Box */}
              <div className="p-3.5 rounded-2xl bg-[#0D1813]/90 border border-heritage-ochre/25 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-heritage-ochre font-bold block">
                    {t('Thuật ngữ Nhân học Không gian (CLIL)', 'Spatial Anthropology Term')}
                  </span>
                  <div className="text-sm sm:text-base font-serif font-semibold text-white">
                    {activeZone.termEn}{' '}
                    <span className="text-xs font-mono text-heritage-ochre ml-1">
                      {activeZone.ipa}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => speechService.speak(activeZone.termEn, 'en')}
                  className="p-2.5 rounded-xl bg-heritage-ochre/15 hover:bg-heritage-ochre text-heritage-ochre hover:text-slate-950 transition-colors shrink-0"
                  title={t('Nghe phát âm thuật ngữ', 'Listen to term')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Anthropological Analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {t(
                      'Phân tích Vũ trụ quan & Xã hội học',
                      'Cosmological & Sociological Analysis'
                    )}
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-heritage-wood/90 leading-relaxed">
                  {t(activeZone.academicAnalysis.vi, activeZone.academicAnalysis.en)}
                </p>
              </div>

              {/* Ecological Role */}
              <div className="p-3.5 rounded-2xl bg-[#0A130E]/80 border border-[#1E3029] space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5" />
                  <span>
                    {t(
                      'Giá trị Kiến trúc Sinh thái & Thích ứng Khí hậu',
                      'Ecological Architecture & Climate Adaptation'
                    )}
                  </span>
                </h4>
                <p className="text-xs text-heritage-wood/85 leading-relaxed">
                  {t(activeZone.ecologicalRole.vi, activeZone.ecologicalRole.en)}
                </p>
              </div>

              {/* Direct Link to the 3D Artifact of this Zone */}
              <div className="pt-2 flex items-center justify-between border-t border-[#1E3029]">
                <span className="text-xs text-heritage-woodMuted">
                  {t('Hiện vật tiêu biểu tại không gian này:', 'Featured artifact in this zone:')}
                </span>
                <Link
                  to={`/artifacts/${activeZone.relatedSlug}`}
                  className="px-4 py-2.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <span>
                    {t(
                      activeZone.relatedArtifactName.vi,
                      activeZone.relatedArtifactName.en
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

