import CircleElements from '@public/assets/icons/circleElement.svg';
import EnvelopIcons from '@public/assets/icons/envelops.svg';
import React from 'react';

import Button from '../../shared/Button';
import mainConfig from '@/@core/configs/mainConfigs';

const Newsletter = ({
  container = false,
  hide = false,
}: {
  container?: boolean;
  hide?: boolean;
}) => {
  return (
    <section
      className={`bg-primary_1 py-12 mt-64 relative overflow-hidden ${hide ? 'hidden' : ''} ${container ? 'rounded-2xl container mx-auto' : ''}`}
    >
      <div
        className={`${container ? '' : mainConfig.maxWidthClass} flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0`}
      >
        {/* Left Section */}
        <div className="flex sm:flex-row flex-col items-center sm:items-start w-full space-x-4 text-white md:w-1/2 relative">
          <EnvelopIcons className="w-64 h-2w-64" />

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold relative">
              Sign Up for Newsletter
              {/* Circle Elements Decoration */}
              <CircleElements className="absolute z-0 right-[202px] top-[44%] transform -translate-y-1/2 w-10 h-10 opacity-60" />
            </h2>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 relative">
          {/* Circle Elements Decoration */}
          <CircleElements className="absolute z-0 right-[45px] top-[113%] transform -translate-y-1/2 w-10 h-10 opacity-60" />

          <form className="relative z-20 flex sm:flex-row flex-col items-center bg-white rounded-md shadow-md w-full p-1 max-w-lg mx-auto overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email here"
              className="flex-grow text-sm px-6 py-4 text-gray-600 placeholder-gray-400 outline-none"
              required
            />
            <Button className="bg-gray-700 text-white h-12 px-8 py-3 rounded-md text-sm font-semibold hover:bg-gray-800 transition-colors">
              SUBSCRIBE
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
