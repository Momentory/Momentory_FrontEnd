import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CultureStampContent from '../../components/stamp/CultureStampContent';
import RegionStampContent from '../../components/stamp/RegionStampContent';

export default function StampCollectionPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: 'culture' | 'region' }>();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>(
    type || 'culture'
  );

  const handleTabChange = (tab: 'culture' | 'region') => {
    setActiveTab(tab);
    navigate(`/stamp-collection/${tab}`, { replace: true });
  };

  return (
    <div>
      {/* 공통 헤더 */}
      <div className="flex border-b-2 border-gray-300 relative">
        <div onClick={() => handleTabChange('culture')}>문화 스탬프</div>
        <div onClick={() => handleTabChange('region')}>지역 스탬프</div>
        {/* 애니메이션 선 */}
      </div>

      {/* 조건부 컨텐츠 렌더링 */}
      {activeTab === 'culture' ? (
        <CultureStampContent />
      ) : (
        <RegionStampContent />
      )}
    </div>
  );
}
