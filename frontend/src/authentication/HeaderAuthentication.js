import React from 'react';
import LogoImg from '@/assets/images/Logo.webp';
const HeaderAuthentication = (props) => {
  return (
    <div className={`container px-20 flex container-logo ${props.position} mt-10`}>
      <div className="container-logo flex items-center">
        <img src={LogoImg} className="w-12" alt="Logo Img" />
        <span className="text-[#FF1515] font-bold pl-2 text-lg">Caffee Shop</span>
      </div>
    </div>
  );
};
export default HeaderAuthentication;
