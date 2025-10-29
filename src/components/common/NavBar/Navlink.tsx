import React from 'react';
import { NavLink as RR_NavLink, type To } from 'react-router-dom';

interface NavLinkProps {
  to: To;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
}

const Navlink = ({ to, Icon, alt }: NavLinkProps) => {
  return (
    <RR_NavLink to={to} className="flex flex-col items-center w-6 relative">
      <div className="relative justify-center items-center flex flex-col gap-1">
        <Icon
          className="w-6 h-6"
        />
        <label className="text-[10px] text-center text-[#903333] leading-3 font-bold whitespace-nowrap">{alt}</label>
      </div>
    </RR_NavLink>
  );
};

export default Navlink;