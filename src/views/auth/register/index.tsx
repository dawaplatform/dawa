import React from 'react';
import RegistrationForm from '@/components/features/forms/registration_form';

const SignupPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md md:max-w-6xl md:bg-white rounded-3xl overflow-hidden md:shadow-md md:border md:border-primary_1 flex flex-col md:flex-row">
        {/* Image panel visible on desktop */}
        <div
          className="hidden md:block w-2/5 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1523705480679-b5d0cc17a656?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3")',
          }}
        ></div>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default SignupPage;
