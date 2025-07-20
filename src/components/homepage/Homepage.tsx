@@ .. @@
 import React from 'react';
-import HeroSection from '../components/homepage/HeroSection';
+import ProfessionalSlider from '../components/homepage/ProfessionalSlider';
 import CustomerTestimonialsSlider from '../components/homepage/CustomerTestimonialsSlider';
@@ .. @@
 const Homepage: React.FC = () => {
   return (
     <div className="overflow-hidden">
-      <HeroSection />
+      <ProfessionalSlider />
       <CustomerTestimonialsSlider />
@@ .. @@
   );
 };
   )
 }