import { getItemTransform, transformToCSS } from '../../config/itemPositions';

interface Accessory {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  type: string;
}

interface CharacterItemsProps {
  effectImageSrc: string | null;
  effectAccessory: Accessory | undefined;
  expressionImageSrc: string | null;
  expressionAccessory: Accessory | undefined;
  equippedAccessories: number[];
  accessories: Accessory[];
}

const CharacterItems = ({
  effectImageSrc,
  effectAccessory,
  expressionImageSrc,
  expressionAccessory,
  equippedAccessories,
  accessories,
}: CharacterItemsProps) => {
  return (
    <>
      {effectImageSrc && effectAccessory && (
        <img
          src={effectImageSrc}
          alt="effect"
          style={{
            transform: transformToCSS(getItemTransform(effectAccessory.id, 'EFFECT')),
          }}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}

      {expressionImageSrc && expressionAccessory && (
        <img
          src={expressionImageSrc}
          alt="expression"
          style={{
            transform: transformToCSS(getItemTransform(expressionAccessory.id, 'EXPRESSION')),
          }}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}

      {equippedAccessories.map((id) => {
        const acc = accessories.find((a) => a.id === id);
        if (!acc || !acc.type) return null;

        const accType = acc.type.toUpperCase();

        if (accType === 'CLOTHING' || accType === 'EFFECT' || accType === 'EXPRESSION') return null;

        const itemTransform = getItemTransform(id, accType);
        const transformStyle = transformToCSS(itemTransform);

        return (
          <img
            key={id}
            src={acc.icon}
            alt={acc.name}
            style={{
              transform: transformStyle,
            }}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        );
      })}
    </>
  );
};

export default CharacterItems;
