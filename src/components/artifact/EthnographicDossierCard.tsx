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
    <div className="soft-glass-card rounded-3xl p-5 sm:p-6 border border-heritage-sand shadow-xs space-y-4">
      {/* Header with ICOM Accession Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-heritage-sand/80 pb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-heritage-clay/15 border border-heritage-clay/30 text-heritage-clay flex items-center justify-center">
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

        <span className="px-3 py-1 rounded-full bg-heritage-cream border border-heritage-sand font-mono text-[11px] font-bold text-heritage-clay">
          {dossier.accessionId}
        </span>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-heritage-cream/60 border border-heritage-sand/70 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-clay flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5" />
            {t('Phân loại Nhân học (Anthropological Taxonomy)', 'Anthropological Taxonomy')}
          </span>
          <p className="font-semibold text-heritage-wood leading-relaxed">
            {t(dossier.anthropologicalTaxonomy.vi, dossier.anthropologicalTaxonomy.en)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-heritage-cream/60 border border-heritage-sand/70 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-clay flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            {t('Nguyên lý Kết cấu & Kỹ nghệ Bản địa', 'Indigenous Structural & Craft Engineering')}
          </span>
          <p className="text-heritage-wood leading-relaxed">
            {t(dossier.structuralPrinciple.vi, dossier.structuralPrinciple.en)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-heritage-cream/60 border border-heritage-sand/70 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-clay flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            {t('Ý nghĩa Vũ trụ quan & Tín ngưỡng (Cosmology)', 'Cosmological & Ritual Significance')}
          </span>
          <p className="text-heritage-wood leading-relaxed">
            {t(dossier.cosmologicalSignificance.vi, dossier.cosmologicalSignificance.en)}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('Tình trạng Bảo tồn & Số hóa', 'Conservation & Digital Preservation Status')}
          </span>
          <p className="text-emerald-950 font-medium leading-relaxed">
            {t(dossier.conservationStatus.vi, dossier.conservationStatus.en)} ({artifactName.vi})
          </p>
        </div>
      </div>

      {/* Academic Citation Box (APA 7th Edition) */}
      <div className="p-3.5 rounded-2xl bg-white border border-heritage-sand space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-woodMuted flex items-center gap-1">
            <BookOpenCheck className="w-3.5 h-3.5 text-heritage-clay" />
            {t('Trích dẫn Học thuật Chuẩn APA 7th', 'Academic Reference Citation (APA 7th)')}
          </span>
          <button
            onClick={handleCopyCitation}
            className="px-2.5 py-1 rounded-lg bg-heritage-cream hover:bg-heritage-sand text-heritage-clay text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">{t('Đã chép', 'Copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{t('Chép trích dẫn', 'Copy APA')}</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] font-mono text-heritage-woodLight leading-relaxed bg-heritage-cream/40 p-2.5 rounded-xl border border-heritage-sand/50">
          <FileText className="w-3 h-3 inline mr-1 text-heritage-clay" />
          {dossier.apaCitation}
        </p>
      </div>
    </div>
  );
};

