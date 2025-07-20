import React from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '+905332002662';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;

  const handleClick = () => {
    console.log('WhatsApp button clicked!', whatsappUrl);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Create the button element
  const buttonElement = (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        pointerEvents: 'auto',
        width: '64px',
        height: '64px'
      }}
    >
      <button
        onClick={handleClick}
        aria-label="WhatsApp ile iletişime geç"
        title="WhatsApp ile iletişime geç"
        style={{
          position: 'relative',
          display: 'block',
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
          width: '100%',
          height: '100%'
        }}
        className="group transform transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Main Button */}
        <div className="relative w-full h-full">
          {/* Pulse Animation Ring */}
          <div 
            className="absolute inset-0 rounded-full animate-pulse opacity-75 shadow-lg pointer-events-none"
            style={{ 
              backgroundColor: '#25D366',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%'
            }}
          />
          
          {/* Ripple Effect */}
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
            style={{ 
              backgroundColor: '#25D366',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%'
            }}
          />

          {/* Button Background */}
          <div 
            className="relative w-full h-full rounded-full shadow-xl transform transition-all duration-300 ease-out group-hover:shadow-2xl flex items-center justify-center backdrop-blur-sm pointer-events-auto"
            style={{ 
              backgroundColor: '#25D366',
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* WhatsApp Icon */}
            <MessageCircle 
              className="w-9 h-9 text-white transform transition-transform duration-300 group-hover:rotate-12 drop-shadow-sm pointer-events-none" 
              fill="currentColor"
              style={{
                width: '36px',
                height: '36px',
                color: 'white'
              }}
            />
          </div>
        </div>

        {/* Tooltip */}
        <div 
          className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0"
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '12px',
            zIndex: 1000000,
            pointerEvents: 'none'
          }}
        >
          <div 
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-sm border border-gray-700"
            style={{
              backgroundColor: 'rgb(17, 24, 39)',
              color: 'white',
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgb(55, 65, 81)'
            }}
          >
            WhatsApp ile mesaj gönder
            {/* Tooltip Arrow */}
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: '20px',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid rgb(17, 24, 39)'
              }}
            />
          </div>
        </div>
      </button>
    </div>
  );

  // Render to document.body using portal to bypass any parent container issues
  return typeof document !== 'undefined' ? createPortal(buttonElement, document.body) : null;
};

export default WhatsAppButton;