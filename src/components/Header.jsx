import React from 'react'
import { FiUser } from 'react-icons/fi'
import { FiPlus } from 'react-icons/fi'
import { useContext } from "react";
import { myContext } from "../Context";


const Header = () => {
    const  {handleToggle } = useContext(myContext);
  
 

  return (
    <div className='p-4 text-2xl  grid grid-cols-2 justify-item-center w-full pt-8'>
      <div>
        <h1 className='font-semibold text-[#2A5C45]'>SmartSet</h1>
      </div>
      <div className='flex justify-end flex-nowrap items-center gap-x-4 '>
        <button className='text-[#2A5C45] rounded-md p-2 border-solid border-[#EAF2EC] border-2  text-base cursor-pointer hover:scale-105 hover:border-3'><FiPlus onClick={handleToggle}/></button>
        <div className='bg-[#2A5C45] rounded-full p-2 text-[#EAF2EC] text-base'><FiUser/></div>
      </div>
    </div>
  )
}

export default Header
