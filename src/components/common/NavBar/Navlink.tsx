import React from 'react';
import { NavLink as RR_NavLink, type To } from 'react-router-dom';

interface NavLinkProps {
  to: To;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
}

const Navlink = ({ to, Icon }: NavLinkProps) => {
  return (
    <RR_NavLink to={to} className="flex flex-col items-center w-8 relative">
      <div className="relative">
        <Icon
          className="w-6 h-6"
        />
      </div>
    </RR_NavLink>
  );
};

export default Navlink;