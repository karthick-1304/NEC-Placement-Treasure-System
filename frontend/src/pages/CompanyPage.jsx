import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useCompany from '../hooks/useCompany.js';
import useDriveFeedbacks from '../hooks/useDriveFeedbacks.js';
import useDrivePrograms from '../hooks/useDrivePrograms.js';
import Breadcrumb from '../components/common/Breadcrumb.jsx';
import Spinner from '../components/common/Spinner.jsx';
import CompanyHero from '../components/company/CompanyHero.jsx';
import YearSelector from '../components/company/YearSelector.jsx';
import DriveInfo from '../components/company/DriveInfo.jsx';
import DriveTabs from '../components/company/DriveTabs.jsx';
import FeedbackTable from '../components/company/FeedbackTable.jsx';
import ProgramTable from '../components/company/ProgramTable.jsx';

export default function CompanyPage() {
  const { companyId } = useParams();
  const [activeTab, setActiveTab] = useState('feedbacks');

  const { selectedCompany, recruitmentYears, selectedDriveId, isLoading, error, handleDriveSelect } =
    useCompany(companyId);

  const selectedDrive = recruitmentYears.find((y) => y.drive_id === selectedDriveId);

  const feedbackProps = useDriveFeedbacks({ companyId, driveId: selectedDriveId });
  const programProps  = useDrivePrograms({ companyId, driveId: selectedDriveId });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-dark-400 animate-pulse">Loading company details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 text-center text-rose-400">{error}</div>
  );

  if (!selectedCompany) return null;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 animate-slide-up">
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Companies', to: '/' },
        { label: selectedCompany.company_name },
      ]} />

      <CompanyHero company={selectedCompany} />

      <YearSelector
        years={recruitmentYears}
        selectedDriveId={selectedDriveId}
        onSelect={handleDriveSelect}
      />

      <DriveInfo drive={selectedDrive} />

      <DriveTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'feedbacks' && (
        <FeedbackTable
        driveId={selectedDriveId}
          feedbacks={feedbackProps.feedbacks}
          pagination={feedbackProps.pagination}
          isLoading={feedbackProps.isLoading}
          error={feedbackProps.error}
          page={feedbackProps.page}
          search={feedbackProps.search}
          setPage={feedbackProps.setPage}
          setSearch={feedbackProps.setSearch}
        />
      )}

      {activeTab === 'programs' && (
        <ProgramTable
          programs={programProps.programs}
          pagination={programProps.pagination}
          isLoading={programProps.isLoading}
          error={programProps.error}
          page={programProps.page}
          search={programProps.search}
          setPage={programProps.setPage}
          setSearch={programProps.setSearch}
        />
      )}
    </div>
  );
}