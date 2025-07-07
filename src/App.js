import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

// Add this style to your CSS
const extraStyles = `
  .embroidered-text {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
`;

const vehicleModels = ['THAR ROXX','THAR', 'XUV700', 'XUV3X0', 'SCORPIO N', 'BOLERO NEO', 'BOLERO'];
const seatViews = ['Front Row', 'Rear Row'];
const accessories = ['Black comfort kit','Sustainable comfort kit'];
const fontStyles = [
  'Arial',
  'Tahoma',
  'Montserrat',
  'Gabriola',
  'Dancing Script',
  'Blackadder ITC'
];

const textColors = [
  { name: 'Blue', value: '#005d8f' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#d10000' },
  { name: 'Beige', value: '#ffe599' },
  { name: 'Silver', value: '#c0c0c0' }
];

const textPositions = {
  'THAR ROXX': {
    'Front Row': {
      'Black comfort kit': [
        { top: '39%', left: '25%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
   
        { top: '39%', left: '74%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
     
      ],
      'Sustainable comfort kit': [
        { top: '39.5%', left: '25%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
   
        { top: '39.5%', left: '73.7%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
    
      ]
    },

  
    'Rear Row': {
      'Black comfort kit': [
 
        { top: '71%', left: '30.8%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '71%', left: '68.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
     
      ],
      'Sustainable comfort kit': [
    
        { top: '70%', left: '31.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },

        { top: '70%', left: '67.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },

    'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '44%', left: '28%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },

        { top: '44%', left: '71.8%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
       
      ],
   
      'Sustainable comfort kit': [
       { top: '44%', left: '27.6%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      
        { top: '44%', left: '72%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
     
      ]
    },


  
    'Rear Row': {
      'Black comfort kit': [

        { top: '56%', left: '32%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '56%', left: '66%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },

      ],
      'Sustainable comfort kit': [
        // { top: '39%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '33%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '39%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '66.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },


  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '31.4%', left: '28.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '67.5%', left: '19%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '31.4%', left: '74.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '66.5%', left: '82%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '31.5%', left: '28%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '72.5%', left: '21%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '31.5%', left: '75%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '72.5%', left: '77%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '61%', left: '35.2%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '69%', left: '19%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '70%', left: '81%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '61%', left: '68%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        { top: '61%', left: '34%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '74.5%', left: '21%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '61.5%', left: '69%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '74.5%', left: '77%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },



  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        // { top: '66.5%', left: '20%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '35.3%', left: '73%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        // { top: '66.5%', left: '80%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        { top: '35%', left: '25.3%', rotation: 0, fontSize: { desktop: 13, mobile: 9 } },
        // { top: '69.5%', left: '27%', rotation: 0, fontSize: { desktop: 18, mobile: 9 } },
        { top: '35%', left: '72.5%', rotation: 0, fontSize: { desktop: 13, mobile: 9 } },
        // { top: '69%', left: '72%', rotation: 0, fontSize: { desktop: 18, mobile: 9 } }
      ]
    },


    
    'Rear Row': {
      'Black comfort kit': [
        // { top: '36.5%', left: '22%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '64%', left: '30.5%', rotation: -1, fontSize: { desktop: 15, mobile: 10 } },
        { top: '64%', left: '71%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '36.5%', left: '78%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        { top: '64%', left: '30%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '57%', left: '23%', rotation: 0, fontSize: { desktop: 18, mobile: 9 } },
        { top: '64%', left: '70%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '38%', left: '78%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },




  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '24%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '66.5%', left: '20%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '35%', left: '70%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '66.5%', left: '77%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],
    
      'Sustainable comfort kit': [
        { top: '35.5%', left: '24%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '67%', left: '18%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '35.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '65.5%', left: '78%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        // { top: '38%', left: '20%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '59%', left: '29%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '59%', left: '70.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '38%', left: '76%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        // { top: '37.5%', left: '20%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '59%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '59%', left: '71.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '38%', left: '77%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },



  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '36.3%', left: '27.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '67.5%', left: '22%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '36%', left: '76%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '67.5%', left: '76%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        { top: '36%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '61%', left: '22%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '36%', left: '76%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '61%', left: '78%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '57%', left: '32%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '71%', left: '22%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '71%', left: '76%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '57%', left: '72%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        // { top: '37.5%', left: '24%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '32.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '72.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '38%', left: '75%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },



  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '34.5%', left: '30%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '58%', left: '21%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '34.5%', left: '70%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '58%', left: '78%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        { top: '34.8%', left: '29.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '59%', left: '19%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '34.8%', left: '69.8%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '59%', left: '78%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        // { top: '31%', left: '22%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '66%', left: '30%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '66%', left: '66.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        // { top: '31.5%', left: '76%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],

      'Sustainable comfort kit': [
        // { top: '31.5%', left: '21%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '66%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '66%', left: '67%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        // { top: '31.5%', left: '75%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  }



};























const loadFonts = async () => {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Montserrat:wght@400;700&display=swap');
    
    @font-face {
      font-family: 'Gabriola';
      src: local('Gabriola'), local('Segoe Script');
    }
    
    @font-face {
      font-family: 'Blackadder ITC';
      src: local('Blackadder ITC'), local('Brush Script MT');
    }
  `;
  document.head.appendChild(style);

  // Wait for fonts to load
  await document.fonts.ready;
};

const EmbroideredText = ({ text, fontFamily, position, textColor, isMobile }) => {
  const uniqueId = `text-${position.top}-${position.left}-${Math.random().toString(36).substring(2, 9)}`;

  const getStrokeColor = (color) => {
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const calculateLuminance = (r, g, b) => {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    if (color.startsWith('#')) {
      const [r, g, b] = hexToRgb(color);
      const luminance = calculateLuminance(r, g, b);
      return luminance > 0.5 ? 'rgba(68, 68, 68, 0.5)' : 'rgba(48, 47, 47, 0.5)';
    }
    const lightColors = ['#ffe599', '#c0c0c0', 'beige', 'ivory', 'white'];
    return lightColors.includes(color.toLowerCase()) 
      ? 'rgba(58, 55, 55, 0.5)' 
      : 'rgba(255, 255, 255, 0.5)';
  };

  const strokeColor = getStrokeColor(textColor);
  
  // Get font size from position configuration
  const fontSize = position.fontSize 
    ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
    : (isMobile ? 10 : 14); // Default fallback sizes

  return (
    <div
      id={uniqueId}
      className="embroidered-text"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`,
        fontFamily: `"${fontFamily}"`,
        fontSize: `${fontSize}px`,
        color: textColor,
        fontStyle: 'italic',
        fontWeight: 'bold',
        WebkitTextStroke: `0.3px ${strokeColor}`,
        textShadow: `
          1px 1px 1px rgba(33, 33, 33, 0.28),
          -1px -1px 1px rgba(71, 71, 71, 0.56),
          0 0 2px rgba(37, 36, 36, 0.3)
        `,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 10
      }}
    >
      {text}
    </div>
  );
};

const App = () => {
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [selectedSeatView, setSelectedSeatView] = useState('Front Row');
  const [selectedAccessory, setSelectedAccessory] = useState('');
  const [personalisedContent, setPersonalisedContent] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState(textColors[0].value);
  const [numSets, setNumSets] = useState(1);
  const imageRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isAdjustMode, setIsAdjustMode] = useState(false);
  const [adjustablePositions, setAdjustablePositions] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });

    const style = document.createElement('style');
    style.textContent = extraStyles;
    document.head.appendChild(style);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (selectedVehicleModel && selectedAccessory && selectedSeatView) {
      const positions = textPositions[selectedVehicleModel]?.[selectedSeatView]?.[selectedAccessory] || [];
      setAdjustablePositions([...positions]);
    }
  }, [selectedVehicleModel, selectedAccessory, selectedSeatView]);

  const getImagePath = () => {
    if (!selectedVehicleModel || !selectedAccessory || !selectedSeatView) {
      return '/EventDayWebsiteSliderBanner-778x450-2.png';
    }
    
    return `/models/${selectedVehicleModel}/${selectedSeatView}/${selectedAccessory}.png`;
  };

  const handleDownload = async () => {
    if (!selectedVehicleModel || !selectedAccessory || !selectedSeatView) {
      setShowPopup(true);
      return;
    }

    const element = imageRef.current;
    if (!element) return;

    try {
      setIsImageLoading(true);
      
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
      const pdf = new jsPDF(orientation, 'mm', 'a4');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10;
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);
      
      const ratio = Math.min(
        availableWidth / imgWidth,
        availableHeight / imgHeight
      );
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;
      
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        x,
        y,
        scaledWidth,
        scaledHeight
      );
      
      const vehicle = selectedVehicleModel || 'vehicle';
      const accessory = selectedAccessory || 'accessory';
      const seat = selectedSeatView === 'Front Row' ? 'front' : 'rear';
      
      const cleanFilename = `${vehicle}-${seat}-${accessory}`
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9\-]/g, '')
        .toLowerCase();
      
      setDownloadedFileName(`${cleanFilename}.pdf`);
      pdf.save(`${cleanFilename}.pdf`);
      
      setIsImageLoading(false);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsImageLoading(false);
      
      try {
        const canvas = await html2canvas(element, { scale: 2 });
        const link = document.createElement('a');
        const vehicle = selectedVehicleModel || 'vehicle';
        const accessory = selectedAccessory || 'accessory';
        const seat = selectedSeatView === 'Front Row' ? 'front' : 'rear';
        
        const cleanFilename = `${vehicle}-${seat}-${accessory}`
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9\-]/g, '')
          .toLowerCase();
        
        link.download = `${cleanFilename}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadedFileName(`${cleanFilename}.jpg`);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        alert("Failed to generate download. Please try again.");
      }
    }
  };

  const updatePosition = (index, property, value) => {
    const newPositions = [...adjustablePositions];
    newPositions[index] = {
      ...newPositions[index],
      [property]: value
    };
    setAdjustablePositions(newPositions);
  };

  const preloadSelectedFont = () => {
    if (!selectedFont) return null;
    
    return (
      <div 
        style={{ 
          fontFamily: selectedFont, 
          fontStyle: 'italic',
          position: 'absolute', 
          visibility: 'hidden', 
          fontSize: '22px'
        }}
      >
        {personalisedContent || "Preload Text"}
      </div>
    );
  };

  return (
    <div className="app-container">
      {preloadSelectedFont()}
      
      <div className="left-panel">
        <h3>PERSONALISED ACCESSORIES</h3>
        <p>Showcase your unique style by personalizing your accessory with elegantly embroidered lettering in your preferred font.</p>

        <label>Vehicle Model</label>
        <select value={selectedVehicleModel} onChange={e => setSelectedVehicleModel(e.target.value)}>
          <option value="" disabled>Select a Vehicle Model</option>
          {vehicleModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        <label>Select Row</label>
        <select 
          value={selectedSeatView} 
          onChange={e => setSelectedSeatView(e.target.value)}
          disabled={!selectedVehicleModel}
        >
          <option value="" disabled>Select Row</option>
          {seatViews.map(view => (
            <option key={view} value={view}>{view}</option>
          ))}
        </select>

        <label>Kit Type</label>
        <select 
          value={selectedAccessory} 
          onChange={e => setSelectedAccessory(e.target.value)}
          disabled={!selectedVehicleModel || !selectedSeatView}
        >
          <option value="" disabled>Select an Accessory</option>
          {accessories.map(acc => (
            <option key={acc} value={acc}>{acc}</option>
          ))}
        </select>

        <label>Personalised Content</label>
        <input
          type="text"
          maxLength={7}
          value={personalisedContent}
          onChange={e => setPersonalisedContent(e.target.value)}
          style={{ fontFamily: selectedFont }}
        />

        <label>Font Style</label>
        <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)}>
          <option value="" disabled>Select a Font Style</option>
          {fontStyles.map(font => (
            <option key={font} value={font} style={{ fontFamily: font, fontStyle: 'italic' }}>
              {font}
            </option>
          ))}
        </select>
        
        <div className="font-preview" style={{ marginTop: '5px', marginBottom: '15px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {/* Preview: The font size is now controlled individually for each position */}
          </span>
        </div>
        
        <label>Select Text Color</label>
        <div className="color-palette">
          {textColors.map(color => (
            <div
              key={color.value}
              className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`}
              style={{ 
                backgroundColor: color.value,
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                margin: '8px 5px 5px 0',
                cursor: 'pointer',
                display: 'inline-block',
                border: selectedColor === color.value ? '2px solid black' : '1px solid #ddd'
              }}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            />
          ))}
        </div>

        <label>No. of Sets</label>
        <div style={{ position: 'relative', width: '100px' }}>
          <input
            type="number"
            min={1}
            value={numSets}
            onChange={e => setNumSets(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: '100%',
              padding: '5px 25px',
              textAlign: 'center',
              MozAppearance: 'textfield'
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '5px',
              top: '55%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => setNumSets(prev => Math.max(1, prev - 1))}
          >−</span>
          <span
            style={{
              position: 'absolute',
              right: '-47px',
              top: '55%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => setNumSets(prev => prev + 1)}
          >+</span>
        </div>
        <div className='download-btn'>
          <button onClick={handleDownload} disabled={isImageLoading}>
            {isImageLoading ? 'Generating PDF...' : 'Download as PDF'}
          </button>
        </div>
      </div>

      <div className="right-panel">
        <div className="image-container" ref={imageRef} style={{ position: 'relative' }}>
          {isImageLoading && (
            <div className="image-loader">
              <img src="/spinning-dots.svg" alt="Loading..." style={{ width: 60, height: 60 }} />
            </div>
          )}

          <img
            src={getImagePath()}
            alt="Accessory Preview"
            className="headrest-image"
            style={{ marginTop:'8%', width: '100%', height: 'auto', display: isImageLoading ? 'none' : 'block' }}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            onLoadStart={() => setIsImageLoading(true)}
          />

          {personalisedContent && selectedVehicleModel && selectedAccessory && selectedSeatView && fontsLoaded && (
            <>
              {(isAdjustMode ? adjustablePositions : textPositions[selectedVehicleModel]?.[selectedSeatView]?.[selectedAccessory] || []).map((position, index) => (
                position ? (
                  <EmbroideredText
                    key={`${index}-${selectedColor}-${selectedFont}`}
                    text={personalisedContent}
                    fontFamily={selectedFont}
                    position={position}
                    textColor={selectedColor}
                    isMobile={isMobile}
                  />
                ) : null
              ))}
            </>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box success-popup">
            <div className="success-icon">✓</div>
            <p>Your PDF "{downloadedFileName}" has been downloaded successfully!</p>
            <button onClick={() => setShowSuccessPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Please select Vehicle Model, Seat Row, and Accessory before downloading</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;