import { TIME_FORMAT } from '@constants/date.constants';
import type { Project } from '@app-types/project.types';
import type { TimeEntry } from '@app-types/time-entry.types';
import { formatDurationString } from '@utils/date.utils';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export type CSVDataRow = Record<
  string,
  string | number | boolean | null | undefined
>;

export function convertToCSV(data: CSVDataRow[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export function downloadFile(
  content: string,
  fileName: string,
  contentType: string,
) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTimeEntriesToCSV(
  entries: TimeEntry[],
  projects: Project[],
  projectName?: string,
) {
  const csvData = entries.map((entry) => {
    const project = projects.find((p) => p.id === entry.projectId);
    return {
      Project: project?.name || 'No Project',
      Description: entry.description || '',
      Date: entry.date,
      'Start Time': dayjs(entry.startTime).format(TIME_FORMAT),
      'End Time': entry.endTime ? dayjs(entry.endTime).format(TIME_FORMAT) : '',
      'Duration (Formatted)': formatDurationString(entry.duration),
      'Duration (Seconds)': entry.duration,
    };
  });

  const csv = convertToCSV(csvData);
  const formattedProjectName = projectName
    ? `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_`
    : '';
  const fileName = `chronify_${formattedProjectName}export_${dayjs().format('YYYY-MM-DD_HHmm')}.csv`;
  downloadFile(csv, fileName, 'text/csv;charset=utf-8;');
}

export function exportTimeEntriesToPDF(
  entries: TimeEntry[],
  projects: Project[],
  projectName?: string,
) {
  const doc = new jsPDF();
  const totalDuration = entries.reduce((acc, curr) => acc + curr.duration, 0);

  // Title
  doc.setFontSize(18);
  doc.text('Chronify Time Report', 14, 22);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${dayjs().format('YYYY-MM-DD HH:mm')}`, 14, 30);
  doc.text(`Total Duration: ${formatDurationString(totalDuration)}`, 14, 37);

  const tableData = entries.map((entry) => {
    const project = projects.find((p) => p.id === entry.projectId);
    return [
      project?.name || 'No Project',
      entry.description || '',
      entry.date,
      `${dayjs(entry.startTime).format(TIME_FORMAT)} - ${
        entry.endTime ? dayjs(entry.endTime).format(TIME_FORMAT) : ''
      }`,
      formatDurationString(entry.duration),
    ];
  });

  autoTable(doc, {
    startY: 45,
    head: [['Project', 'Description', 'Date', 'Time Range', 'Duration']],
    body: tableData,
    foot: [['', '', '', 'Grand Total', formatDurationString(totalDuration)]],
    theme: 'striped',
    headStyles: { fillColor: [224, 49, 49] }, // Tomato primary color
  });

  const formattedProjectName = projectName
    ? `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_`
    : '';
  doc.save(
    `chronify_${formattedProjectName}report_${dayjs().format('YYYY-MM-DD_HHmm')}.pdf`,
  );
}
