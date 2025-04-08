'use client';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import { MdOutlineStar, MdPlayArrow } from 'react-icons/md';
import PuffLoader from 'react-spinners/PuffLoader';
import mainConfig from '@/@core/configs/mainConfigs';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(true);
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className={`${mainConfig.maxWidthClass} text-center mx-auto`}>
        {/* Icon Section */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-primary_1">
            <MdOutlineStar className="text-primary_1 text-2xl" />
          </div>
        </div>

        {/* Text Section */}
        <h2 className="text-3xl font-bold text-gray-900">
          We serve customers around the world <br />
          with the best electronic products
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-5xl mx-auto leading-relaxed">
          Our curated selection of top-quality electronics is designed to meet
          the demands of modern life. Experience innovation and excellence,
          delivered right to your doorstep.
        </p>
      </div>

      {/* Video/Thumbnail Section */}
      <div
        className={`mt-10 relative w-full ${mainConfig.maxWidthClass} mx-auto`}
      >
        {/* Thumbnail Display */}
        {!isPlaying && (
          <div className="relative group rounded-xl overflow-hidden shadow-lg h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=60"
              alt="Video Preview"
              fill
              className="object-cover"
            />
            {/* Accessible Play Button */}
            <button
              onClick={handlePlay}
              aria-label="Play Video"
              className="absolute inset-0 flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <div className="bg-primary_1 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                <MdPlayArrow className="text-white text-4xl" />
              </div>
            </button>
          </div>
        )}

        {/* Video Player Display */}
        {isPlaying && (
          <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <PuffLoader color="#FFA200" />
              </div>
            )}
            <ReactPlayer
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              playing
              controls
              width="100%"
              height="100%"
              className="rounded-xl"
              onReady={handleReady}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
