import { useState, useEffect, useRef } from 'react';
import EventSkeleton from './EventSkeleton';
import EventListModal from './EventListModal';
import EventDetailModal from './EventDetailModal';

interface EventSectionProps {
  events: any[];
  isLoading?: boolean;
}

const EventSection = ({ events, isLoading = false }: EventSectionProps) => {
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= events.length - 2) {
          return 0;
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  useEffect(() => {
    if (scrollContainerRef.current && events.length > 0) {
      const container = scrollContainerRef.current;
      const firstCard = container.children[0] as HTMLElement;

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 12;
        const scrollPosition = (cardWidth + gap) * currentIndex;

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex, events.length]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="px-6 mt-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[23px] font-extrabold text-gray-900">
          진행중인 이벤트
        </h2>
        <button
          onClick={() => setIsListModalOpen(true)}
          className="text-[13px] text-gray-500 hover:text-[#FF7070]"
        >
          모두 보기 &gt;
        </button>
      </div>

      <div className="relative">
        {isLoading ? (
          <EventSkeleton />
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-3 scroll-smooth hide-scrollbar"
          >
            {events.map((evt: any, i) => (
              <div
                key={i}
                onClick={() => handleEventClick(evt)}
                className="flex-shrink-0 w-[calc((100vw-72px)/3)] max-w-[calc((480px-72px)/3)] aspect-[3/4] rounded-[12px] overflow-hidden shadow-md bg-white cursor-pointer hover:scale-[1.03] transition"
              >
                <img
                  src={evt.imageUrl ?? `/images/event${i + 1}.png`}
                  alt={evt.title ?? `event${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && events.length > 3 && (
        <div className="flex justify-center gap-2 mt-3">
          {events.slice(0, events.length - 2).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleIndicatorClick(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'bg-[#ff7070] w-6'
                  : 'bg-gray-300'
              }`}
              aria-label={`슬라이드 ${idx + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {isListModalOpen && (
        <EventListModal
          events={events}
          onClose={() => setIsListModalOpen(false)}
          onEventClick={handleEventClick}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
};

export default EventSection;
