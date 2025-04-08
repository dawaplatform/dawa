'use client';
import { assetConfig } from '@/@core/configs/assestConfig';
import VideoSection from './VideoSection';
import CustomImage from '@/components/shared/CustomImage';
import mainConfig from '@/@core/configs/mainConfigs';
import Logo from '@public/assets/svgs/DAWA_VARIATION_04.svg';
import {
  MdOutlineStar,
  MdOutlineSecurity,
  MdOutlineSupportAgent,
  MdOutlineFlashOn,
} from 'react-icons/md';

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className={`${mainConfig.maxWidthClass} w-full pt-12`}>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Text Section */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to Dawa Marketplace
            </h1>
            <p className="mt-4 text-gray-600 text-lg lg:max-w-2xl leading-relaxed">
              At Dawa, we are proud to be Uganda’s leading online marketplace.
              We connect communities, empower local businesses, and bring you a
              secure, user-friendly platform for buying, selling, and
              advertising. Experience a marketplace built with your needs in
              mind.
            </p>
          </div>
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Logo className="w-40 h-auto" />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className={`${mainConfig.maxWidthClass} w-full`}>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Image */}
          <div className="lg:col-span-2 rounded-xl w-full h-[220px] md:h-[320px] lg:h-[450px] overflow-hidden shadow-lg">
            <CustomImage
              src={assetConfig.aboutPage.aboutSection1_3.src}
              alt={assetConfig.aboutPage.aboutSection1_3.alt}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Stacked Images */}
          <div className="grid grid-rows-2 gap-6">
            <div className="rounded-xl w-full h-[220px] md:h-[320px] lg:h-[220px] overflow-hidden shadow-lg">
              <CustomImage
                src={assetConfig.aboutPage.aboutSection1_2.src}
                alt={assetConfig.aboutPage.aboutSection1_2.alt}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="rounded-xl w-full h-[220px] md:h-[320px] lg:h-[220px] overflow-hidden shadow-lg">
              <CustomImage
                src={assetConfig.aboutPage.aboutSection1_1.src}
                alt={assetConfig.aboutPage.aboutSection1_1.alt}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Core Values / Features Section */}
      <section className={`${mainConfig.maxWidthClass} text-center`}>
        <h2 className="text-3xl font-bold text-gray-900">Why Choose Dawa?</h2>
        <p className="mt-4 text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
          Our commitment is to empower Ugandans with a marketplace that is
          trusted, secure, and built for growth. At Dawa, every feature and
          service is designed to help you connect, trade, and thrive.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {[
            {
              icon: MdOutlineStar,
              title: 'Verified Listings',
              description:
                'Shop with confidence knowing every listing is carefully verified.',
            },
            {
              icon: MdOutlineSecurity,
              title: 'Secure Payments',
              description:
                'Enjoy a safe and secure payment experience with every transaction.',
            },
            {
              icon: MdOutlineSupportAgent,
              title: 'Dedicated Support',
              description:
                'Our customer support is available 24/7 to assist you at every step.',
            },
            {
              icon: MdOutlineFlashOn,
              title: 'Fast & Simple',
              description:
                'Experience a streamlined process for posting, buying, and selling.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-between items-center max-w-[300px] px-6 py-12 rounded-xl border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary_1 text-white mb-4">
                <item.icon className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={`${mainConfig.maxWidthClass} py-12`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="relative w-full h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
            <CustomImage
              src={assetConfig.aboutPage.aboutSection2.src}
              alt={assetConfig.aboutPage.aboutSection2.alt}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Join the Dawa Community Today
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Whether you’re a seasoned trader or just starting out, Dawa is the
              platform for you. Connect with thousands of Ugandans who are
              already enjoying a trusted, efficient, and vibrant marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* More About Us Section */}
      <section className={`${mainConfig.maxWidthClass} py-12`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Our Story
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Dawa was founded with a simple vision: to empower local
              communities by making trade accessible and secure. From humble
              beginnings to becoming Uganda’s top online marketplace, our
              journey is fueled by innovation, trust, and a commitment to our
              users.
            </p>
          </div>

          {/* Image Section */}
          <div className="relative w-full h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
            <CustomImage
              src={assetConfig.aboutPage.aboutSection3.src}
              alt={assetConfig.aboutPage.aboutSection3.alt}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
