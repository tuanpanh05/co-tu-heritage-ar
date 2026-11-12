import React, { useState } from 'react';
import { EthnographicDossier } from '../../data/academicAnatomyData';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  FileText,
  Copy,
  Check,
  Award,
  Compass,
  Cpu,
  Globe2,
  ShieldCheck,
  BookOpenCheck
} from 'lucide-react';

interface EthnographicDossierCardProps {
  dossier: EthnographicDossier;
  artifactName: { vi: string; en: string };
}

export const EthnographicDossierCard: React.FC<EthnographicDossierCardProps> = ({
  dossier,
  artifactName
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    try {
      navigator.clipboard.writeText(dossier.apaCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="soft-glass-card rounded-3xl p-5 sm:p-6 border border-[#1E3029] shadow-xs space-y-4">
      {/* Header with ICOM Accession Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E3029] pb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#14221A] border border-heritage-ochre/25 text-heritage-ochre flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif font-semibold text-heritage-wood">
              {t(
                'Phiếu Định Danh Bảo Tàng & Hồ Sơ Điền Dã',
                'ICOM Museum Cataloging & Ethnographic Dossier'
              )}
            </h3>
            <span className="text-[11px] text-heritage-woodMuted">
              {t('Chuẩn lưu trữ Bảo tàng Dân tộc học & UNESCO', 'Ethnological & UNESCO Digital Archiving Standard')}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#0D1813] border border-heritage-ochre/25 font-mono text-[11px] font-bold text-heritage-ochre">
          {dossier.accessionId}
        </span>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-[#0D1813]/80 border border-[#1E3029] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5" />
            {t('Phân loại Nhân học (Anthropological Taxonomy)', 'Anthropological Taxonomy')}
          </span>
          <p className="font-semibold text-heritage-wood leading-relaxed">
            {t(dossier.anthropologicalTaxonomy.vi, dossier.anthropologicalTaxonomy.en)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D1813]/80 border border-[#1E3029] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            {t('Nguyên lý Kết cấu & Kỹ nghệ Bản địa', 'Indigenous Structural & Craft Engineering')}
          </span>
          <p className="text-heritage-wood leading-relaxed">
            {t(dossier.structuralPrinciple.vi, dossier.structuralPrinciple.en)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D1813]/80 border border-[#1E3029] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            {t('Ý nghĩa Vũ trụ quan & Tín ngưỡng (Cosmology)', 'Cosmological & Ritual Significance')}
          </span>
          <p className="text-heritage-wood leading-relaxed">
            {t(dossier.cosmologicalSignificance.vi, dossier.cosmologicalSignificance.en)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#0E1A14]/80 border border-emerald-600/30 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('Tình trạng Bảo tồn & Số hóa', 'Conservation & Digital Preservation Status')}
          </span>
          <p className="text-emerald-200 font-medium leading-relaxed">
            {t(dossier.conservationStatus.vi, dossier.conservationStatus.en)} ({artifactName.vi})
          </p>
        </div>
      </div>

      {/* Academic Citation Box (APA 7th Edition) */}
      <div className="p-3.5 rounded-2xl bg-[#0A120E] border border-[#1E3029] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-woodMuted flex items-center gap-1">
            <BookOpenCheck className="w-3.5 h-3.5 text-heritage-ochre" />
            {t('Trích dẫn Học thuật Chuẩn APA 7th', 'Academic Reference Citation (APA 7th)')}
          </span>
          <button
            onClick={handleCopyCitation}
            className="px-2.5 py-1 rounded-lg bg-[#14221A] hover:bg-[#1E3029] text-heritage-ochre text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">{t('Đã chép', 'Copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{t('Chép trích dẫn', 'Copy APA')}</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] font-mono text-heritage-woodLight leading-relaxed bg-[#0D1813] p-2.5 rounded-xl border border-[#1E3029]">
          <FileText className="w-3 h-3 inline mr-1 text-heritage-ochre" />
          {dossier.apaCitation}
        </p>
      </div>
    </div>
  );
};

