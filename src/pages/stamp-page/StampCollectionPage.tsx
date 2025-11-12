import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import CultureStampContent from '../../components/stamp/CultureStampContent';
import RegionStampContent from '../../components/stamp/RegionStampContent';

export default function StampCollectionPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: 'culture' | 'region' }>();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>(
    type || 'culture'
  );

  useEffect(() => {
    if (type) {
      setActiveTab(type);
    }
  }, [type]);

  const handleTabChange = (tab: 'culture' | 'region') => {
    setActiveTab(tab);
    navigate(`/stamp-collection/${tab}`, { replace: true });
  };

  const dropdownItems = [
    { label: '문화 스탬프', path: '/stamp-collection/culture' },
    { label: '지역 스탬프', path: '/stamp-collection/region' },
  ];

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      <DropdownHeader
        title="스탬프"
      />

      {/* 조건부 컨텐츠 렌더링 */}
      <div className="pt-2">
        {activeTab === 'culture' ? (
          <CultureStampContent />
        ) : (
          <RegionStampContent />
        )}
      </div>
    </div>
  );
}
