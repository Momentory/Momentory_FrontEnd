import Modal from '../common/Modal';
import pageTemplate1Icon from '../../assets/icons/pageTemplete1.svg';
import pageTemplate2Icon from '../../assets/icons/pageTemplete2.svg';
import pageTemplate3Icon from '../../assets/icons/pageTemplete3.svg';
import pageTemplate4Icon from '../../assets/icons/pageTemplete4.svg';
import titleTemplate1 from '../../assets/icons/titleTemplete1.svg';
import titleTemplate2 from '../../assets/icons/titleTemplete2.svg';
import titleTemplate3 from '../../assets/icons/titleTemplete3.svg';
import titleTemplate4 from '../../assets/icons/titleTemplete4.svg';

interface TemplateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: number;
  onSelectTemplate: (templateId: number) => void;
}

const TemplateEditModal: React.FC<TemplateEditModalProps> = ({
  isOpen,
  onClose,
  currentTemplateId,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const titleTemplates = [
    { id: 1, image: titleTemplate1 },
    { id: 2, image: titleTemplate2 },
    { id: 3, image: titleTemplate3 },
    { id: 4, image: titleTemplate4 },
  ];

  const pageTemplates = [
    { id: 11, image: pageTemplate1Icon },
    { id: 12, image: pageTemplate2Icon },
    { id: 13, image: pageTemplate3Icon },
    { id: 14, image: pageTemplate4Icon },
  ];

  const isTitleTemplate = currentTemplateId <= 4;
  const templates = isTitleTemplate ? titleTemplates : pageTemplates;

  return (
    <Modal title="템플릿 수정" onClose={onClose}>
      <div className="w-full px-4">
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onSelectTemplate(template.id);
                onClose();
              }}
              className={`w-full rounded-lg overflow-hidden border-2 transition ${
                currentTemplateId === template.id
                  ? 'border-[#FF7070]'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={template.image}
                alt={`Template ${template.id}`}
                className="w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default TemplateEditModal;


