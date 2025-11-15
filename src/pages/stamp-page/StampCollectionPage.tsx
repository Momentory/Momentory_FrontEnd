import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DropdownHeader from '../../components/common/DropdownHeader';
import CultureStampContent from '../../components/stamp/CultureStampContent';
import RegionStampContent from '../../components/stamp/RegionStampContent';

export default function StampCollectionPage() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: 'culture' | 'region' }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'culture' | 'region'>(
    type || 'culture'
  );

  useEffect(() => {
    if (type) {
      setActiveTab(type);
    }
  }, [type]);

  return (
    <>
      <DropdownHeader
        title="스탬프"
        onLeftClick={() => navigate('/home')}
      />
      <div className="fixed top-[116px] left-0 right-0 bottom-20 max-w-[480px] mx-auto bg-white overflow-y-auto z-10">
        {activeTab === 'culture' ? (
          <CultureStampContent />
        ) : (
          <RegionStampContent />
        )}
      </div>
    </>
  );
}
