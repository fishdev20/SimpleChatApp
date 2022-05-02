import React, {useState} from 'react';
import styled from 'styled-components';

const BurgerStyle = styled.div`
  width: 30px;
  height: 25px;
  top: 0;
  z-index: 99999;
  padding: 5px;
  margin: 10 auto;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;
  span {
      display: block;
      position: absolute;
      height: 4px;
      width: 100%;
      background: #d3531a;
      border-radius: 10px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: .25s ease-in-out;
  }
  span:nth-child(1) {
      top: 5px;
      transform-origin: left center;
  }

   span:nth-child(2) {
      top: 16px;
      transform-origin: left center;
   }

    span:nth-child(3) {
       top: 26px;
       transform-origin: left center;
    }
    .open1 {
        transform: rotate(45deg);
        top: -3px;
        left: 8px;
    }
    .open2 {
        width: 0%;
        opacity: 0;
    }
    .open3 {
        transform: rotate(-45deg);
        top: 39px;
        left: 8px;
    }
`;

const NavBurger = ({openNav,setOpenNav}) => {

    const handleClick = () => {
        setOpenNav(!openNav)
    }
    return(
        <BurgerStyle onClick={handleClick}>
            <span className={openNav ? 'open1' : 'line'}></span>
            <span className={openNav ? 'open2' : 'line'}></span>
            <span className={openNav ? 'open3' : 'line'}></span>
        </BurgerStyle>
    )
}

export default NavBurger;