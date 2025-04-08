import Gadgets from '@public/assets/images/gadgets.png';
import Perfumes from '@public/assets/images/perfums.png';
import Shoe from '@public/assets/images/shoe.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../shared/Button';

const slides: any[] = [
  {
    id: 1,
    title: 'Upgrade Your Style with Trendy Shoes',
    subtitle: 'Start from',
    price: 'UGX80,000',
    imageUrl: Shoe,
    bgColor: 'bg-red-200',
  },
  {
    id: 2,
    title: 'Discover the Latest Gadgets for Your Desk',
    subtitle: 'Start from',
    price: 'UGX50,000',
    imageUrl: Gadgets,
    bgColor: 'bg-gray-200',
  },
  {
    id: 3,
    title: 'Indulge in Premium Fragrances',
    subtitle: 'Starting at',
    price: 'UGX30,000',
    imageUrl: Perfumes,
    bgColor: 'bg-purple-200',
  },
];

const Highlight_Carousel: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    slideInterval.current = setInterval(nextSlide, 5000);
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const handleMouseLeave = () => {
    slideInterval.current = setInterval(nextSlide, 5000);
  };

  return (
    <div
      className="relative w-full container mx-auto h-auto sm:h-[400px] md:h-[500px] flex items-center my-8 justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div
        className="relative w-full h-full flex lg:gap-6 transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`w-full flex-shrink-0 h-full ${slide.bgColor} ${
              currentSlide === index ? 'scale-100' : 'scale-95'
            } rounded-2xl shadow-lg overflow-hidden relative transition-transform duration-700 ease-in-out`}
          >
            {/* Slide Content */}
            <div className="flex flex-col md:flex-row items-center justify-between h-full relative gap-4 p-4 sm:p-6 md:p-8">
              {/* Overlay for Text */}
              <div className="w-full md:w-1/2 z-10 flex flex-col items-start justify-center gap-3 sm:gap-4 p-2 sm:p-4 text-black">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  HOT PRODUCTS
                </p>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-5xl font-bold lg:leading-tight">
                  {slide.title}
                </h2>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-xs sm:text-sm">{slide.subtitle}</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary_1">
                    {slide.price}
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/prod/${slide.id}`)}
                  className="mt-3 px-2 sm:mt-4 h-10 lg:h-12 lg:w-[240px] w-full sm:w-auto max-w-[200px] bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  LEARN MORE
                </Button>
              </div>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-full relative">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute -bottom-8 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer transition-all duration-300 ${
              currentSlide === index
                ? 'w-4 h-2 bg-primary_1 rounded-full'
                : 'w-2 h-2 bg-gray-400 rounded-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Highlight_Carousel;
