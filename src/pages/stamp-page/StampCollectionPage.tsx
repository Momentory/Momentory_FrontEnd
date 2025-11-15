import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen">
      <DropdownHeader
        title="스탬프"
        onLeftClick={() => navigate('/home')}
      />

      {/* 조건부 컨텐츠 렌더링 */}
      <div>
        {activeTab === 'culture' ? (
          <CultureStampContent />
        ) : (
          <RegionStampContent />
        )}
      </div>
    </div>
  );
}
