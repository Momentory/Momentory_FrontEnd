import Modal from '../common/Modal';

interface EventListModalProps {
  events: any[];
  onClose: () => void;
  onEventClick: (event: any) => void;
}

const EventListModal = ({ events, onClose, onEventClick }: EventListModalProps) => {
  const handleEventClick = (event: any) => {
    onEventClick(event);
    onClose();
  };

  return (
    <Modal title="진행중인 이벤트" onClose={onClose}>
      <div className="w-full overflow-y-auto overflow-x-hidden hide-scrollbar">
        <div className="grid grid-cols-3 gap-3">
          {events.map((evt: any, i) => (
            <div
              key={i}
              onClick={() => handleEventClick(evt)}
              className="aspect-[3/4] rounded-[12px] overflow-hidden shadow-md bg-white cursor-pointer hover:scale-[1.03] transition"
            >
              <img
                src={evt.imageUrl ?? `/images/event${i + 1}.png`}
                alt={evt.title ?? `event${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default EventListModal;
