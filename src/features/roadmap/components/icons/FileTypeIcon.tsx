import PdfFileIcon from './PdfFileIcon';
import DocFileIcon from './DocFileIcon';
import CsvFileIcon from './CsvFileIcon';
import DefaultFileIcon from './DefaultFileIcon';

type FileTypeIconProps = {
  fileName: string;
  className?: string;
};

export default function FileTypeIcon({ fileName, className }: FileTypeIconProps) {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') return <PdfFileIcon className={className} />;
  if (extension === 'doc' || extension === 'docx') return <DocFileIcon className={className} />;
  if (extension === 'csv') return <CsvFileIcon className={className} />;
  return <DefaultFileIcon className={className} />;
}
