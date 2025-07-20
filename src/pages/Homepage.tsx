import React from 'react';
import HeroSection from '../components/homepage/HeroSection';
import CustomerTestimonialsSlider from '../components/homepage/CustomerTestimonialsSlider';
import ServicesOverview from '../components/homepage/ServicesOverview';
import BeforeAfterSection from '../components/homepage/BeforeAfterSection';
import WhyChooseUs from '../components/homepage/WhyChooseUs';
import ModernImageSlider from '../components/homepage/ModernImageSlider';
import TestimonialsSection from '../components/homepage/TestimonialsSection';
import CTASection from '../components/homepage/CTASection';

const Homepage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <CustomerTestimonialsSlider />
      <ServicesOverview />
      <BeforeAfterSection />
      <WhyChooseUs />
      <ModernImageSlider />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Homepage;