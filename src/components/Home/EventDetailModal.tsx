import Modal from '../common/Modal';

interface EventDetailModalProps {
  event: {
    title: string;
    startDate: string;
    endDate: string;
    region: string;
    imageUrl: string;
  };
  onClose: () => void;
}

const EventDetailModal = ({ event, onClose }: EventDetailModalProps) => {
  return (
    <Modal title="이벤트 상세" onClose={onClose}>
      <div className="w-full overflow-y-auto -mx-4 hide-scrollbar pb-4">
        <div className="flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-[80%] object-cover rounded-lg"
            />
          </div>

          <div className="px-6">
            <h3 className="text-lg font-extrabold text-gray-900 break-words">
              {event.title}
            </h3>
          </div>

          <div className="space-y-3 px-6">
            <div>
              <p className="text-sm text-[#ff7070] font-bold">기간</p>
              <p className="text-base font-semibold text-gray-800">
                {event.startDate} ~ {event.endDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#ff7070] font-bold">지역</p>
              <p className="text-base font-semibold text-gray-800">
                {event.region}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailModal;
