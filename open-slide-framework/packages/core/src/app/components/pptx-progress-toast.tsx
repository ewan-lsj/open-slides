import { Loader2 } from 'lucide-react';
import { format, useLocale } from '@/lib/use-locale';
import type { PptxExportProgress } from '../lib/export-pptx';
import { formatFidelityReport } from '../lib/pptx-fidelity/invariants';
import { Progress } from './ui/progress';

export function PptxProgressToast({ progress }: { progress: PptxExportProgress }) {
  const t = useLocale();
  const text =
    progress.phase === 'processing'
      ? format(t.pptxToast.processing, {
          current: progress.current.toString().padStart(2, '0'),
          total: progress.total.toString().padStart(2, '0'),
        })
      : progress.phase === 'generating'
        ? t.pptxToast.generating
        : t.pptxToast.done;

  const report =
    progress.reports && progress.reports.length > 0
      ? formatFidelityReport(
          progress.reports.reduce(
            (acc, current) => {
              const rasterReasons = { ...acc.rasterReasons };
              for (const [reason, count] of Object.entries(current.rasterReasons)) {
                rasterReasons[reason] = (rasterReasons[reason] ?? 0) + count;
              }
              return {
                nativeCount: acc.nativeCount + current.nativeCount,
                rasterCount: acc.rasterCount + current.rasterCount,
                textCount: acc.textCount + current.textCount,
                shapeCount: acc.shapeCount + current.shapeCount,
                imageCount: acc.imageCount + current.imageCount,
                rasterReasons,
              };
            },
            {
              nativeCount: 0,
              rasterCount: 0,
              textCount: 0,
              shapeCount: 0,
              imageCount: 0,
              rasterReasons: {} as Record<string, number>,
            },
          ),
        )
      : progress.report
        ? formatFidelityReport(progress.report)
        : undefined;

  return (
    <div className="flex w-80 items-start gap-3 rounded-[8px] border border-border bg-popover px-3.5 py-3 text-popover-foreground shadow-floating">
      <Loader2 className="mt-0.5 size-3.5 shrink-0 animate-spin text-accent-blue" />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[12.5px] font-semibold tracking-tight">
          {t.pptxToast.title}
        </p>
        <p className="truncate font-mono text-[10.5px] tracking-[0.04em] text-muted-foreground">
          {text}
        </p>
        {report ? (
          <p className="truncate font-mono text-[9.5px] tracking-[0.04em] text-muted-foreground">
            {report}
          </p>
        ) : progress.fallbackCount ? (
          <p className="truncate font-mono text-[9.5px] tracking-[0.04em] text-muted-foreground">
            {format(t.pptxToast.fallbacks, { count: String(progress.fallbackCount) })}
          </p>
        ) : null}
        <Progress value={Math.round(progress.percent)} className="mt-2 h-[3px]" />
      </div>
    </div>
  );
}
