'use client'

import React, { useEffect, useState } from 'react'
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"; // react icon for web ถ้าเป็น native ติดตั้ง packet ของ native

const Img = [
    { url: "/images/slide/slide1.jpg", title: "Slide 1" },
    { url: "/images/slide/slide2.jpg", title: "Slide 2" },
    { url: "/images/slide/slide3.jpg", title: "Slide 3" },
    { url: "/images/slide/slide4.jpg", title: "Slide 4" },
];

export default function Slide() {

    const [current, setCurrent] = useState(0);
    const length = Img.length;
    
    
    const nextSlide = () => {
        // กดถัดไป จะให้ รูปปัจจุบัน +1 ถ้า ถึงรูปสุดท้าย จะกลับไปยังรูปแรก
        setCurrent(prev => (prev === length - 1 ? 0 : prev + 1));
    }

    const prevSlide = () => {
        // กดย้อนกลับ จะให้ รูปปัจจุบัน -1 ถ้า ถึงรูปแรก จะกลับไปยังรูปสุดท้าย
        setCurrent(prev => (prev === 0 ? length - 1 : prev - 1));
    }

    useEffect(() => {
        // slide เลือยทุกๆ 8 วินาที
        const interval = setInterval(() => {
            nextSlide();
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='overflow-hidden relative'>
            <div className='flex transition ease-out duration-40'
                style={{ transform: `translateX(-${current * 100}%)` }}>
                {/* transform คือการเปลี่ยนสไลด์ ถ้า current = 0 จะเป็นรูปแรก  */}
                {Img.map((item, index) => (
                    <img src={item.url} width={'100%'} key={index} alt={item.title} className={`rounded-xl `} />
                    
                ))}
            </div>
            {/* ปุ่ม ถัดไป และ ย้อนกลับ  */}
            <div className='absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl'>

                <button onClick={prevSlide}>
                    <FaArrowCircleLeft size={30} />
                </button>
                <button onClick={nextSlide}>
                    <FaArrowCircleRight size={30} />
                </button>
            </div>
            {/* อันนี้จะเป็นจุดสีขาวด้านล่าง slide */}
            <div className='absolute bottom-0 py-4 flex justify-center gap-3 w-full'>
                {Img.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-5 h-5 rounded-full cursor-pointer ${current === index ? 'bg-white' : 'bg-gray-300'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
