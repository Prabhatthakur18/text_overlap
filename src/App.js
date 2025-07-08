import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

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
        { top: '57%', left: '33%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '66.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '31%', left: '28.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '31%', left: '74.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '31.5%', left: '28%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '31.5%', left: '75%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '61%', left: '35.2%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '61%', left: '68%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '61%', left: '34%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '61.5%', left: '69%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '35.3%', left: '73%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '35%', left: '25.3%', rotation: 0, fontSize: { desktop: 13, mobile: 9 } },
        { top: '35%', left: '72.5%', rotation: 0, fontSize: { desktop: 13, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '64%', left: '30.5%', rotation: -1, fontSize: { desktop: 15, mobile: 10 } },
        { top: '64%', left: '71%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '64%', left: '30%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '64%', left: '70%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '24%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '35%', left: '70%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '35.5%', left: '24%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '35.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '59%', left: '29%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '59%', left: '70.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '59%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '59%', left: '71.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '36.3%', left: '27.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '36%', left: '76%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36%', left: '27%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '36%', left: '76%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '57%', left: '32%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '57%', left: '72%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '57%', left: '32.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '72.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '34.5%', left: '30%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '34.5%', left: '70%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '34.8%', left: '29.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '34.8%', left: '69.8%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '66%', left: '30%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '66%', left: '66.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '66%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '66%', left: '67%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
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
  
  const fontSize = position.fontSize 
    ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
    : (isMobile ? 10 : 14);

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

const OrderForm = ({ 
  onClose, 
  onDownload, 
  onShare,
  selectedVehicleModel,
  selectedSeatView,
  selectedAccessory,
  personalisedContent,
  selectedFont,
  selectedColor,
  numSets,
  previewImage
}) => {
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [dealershipAddress, setDealershipAddress] = useState('');
  const [dealershipPhone, setDealershipPhone] = useState('');
  const [errors, setErrors] = useState({});

  const orderFormRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!orderNo.trim()) newErrors.orderNo = 'Order Number is required';
    if (!dealershipName.trim()) newErrors.dealershipName = 'Dealership Name is required';
    if (!customerMobile.match(/^\d{10}$/)) newErrors.customerMobile = 'Customer Mobile must be 10 digits';
    if (!dealershipPhone.match(/^\d{10}$/)) newErrors.dealershipPhone = 'Dealership Phone must be 10 digits';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const messages = Object.values(newErrors).join('\n');
      alert(messages);
      const firstError = Object.keys(newErrors)[0];
      const firstField = document.querySelector(`[name="${firstError}"]`);
      if (firstField) firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '8px 12px',
    border: errors[fieldName] ? '2px solid red' : '1px solid #ddd',
    borderRadius: '4px'
  });

const handleDownloadOrder = async () => {
  if (!orderFormRef.current) return;
  if (!validateForm()) return;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let currentY = 10;

    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);

    // Logo
    const logoUrl = '/logooo.png';
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });
    pdf.addImage(logoDataUrl, 'PNG', 20, currentY, 30, 20);
    currentY += 25;

    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 93, 143);
    pdf.text('ORDER DETAILS', pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    pdf.setDrawColor(0, 93, 143);
    pdf.setLineWidth(0.5);
    pdf.line(15, currentY, pageWidth - 15, currentY);
    currentY += 7;

    // Helpers
    const addSection = (title) => {
      pdf.setFillColor(240, 240, 240);
      pdf.rect(15, currentY, pageWidth - 30, 8, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(title, 18, currentY + 5.5);
      currentY += 12;
    };

    const addDetail = (label, value, spacing = 6) => {
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${label}: ${value || 'N/A'}`, 20, currentY);
      currentY += spacing;
    };

    const addBottomLine = () => {
      currentY += 2;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(15, currentY, pageWidth - 15, currentY);
      currentY += 6;
    };

    // ORDER INFO
    addSection('ORDER INFORMATION');
    addDetail('Order Number', orderNo);
    addDetail('Order Date', orderDate);
    addBottomLine();

    // CUSTOMER INFO
    addSection('CUSTOMER DETAILS');
    addDetail('Full Name', customerName);
    addDetail('Mobile', customerMobile);
    addDetail('Address', customerAddress);
    addBottomLine();

    // DEALERSHIP INFO
    addSection('DEALERSHIP DETAILS');
    addDetail('Name', dealershipName);

    // Multiline Address
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(50, 50, 50);
    const addressLines = pdf.splitTextToSize(`Address: ${dealershipAddress || 'N/A'}`, pageWidth - 40);
    pdf.text(addressLines, 20, currentY);
    currentY += addressLines.length * 6;

    // Phone
    addDetail('Phone', dealershipPhone);
    addBottomLine();

    // DESIGN PREVIEW
    addSection('DESIGN PREVIEW');
    if (previewImage) {
      const imgWidth = 100;
      const imgHeight = 60;
      const imgX = (pageWidth - imgWidth) / 2;
      pdf.addImage(previewImage, 'JPEG', imgX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 8;
    } else {
      addDetail('Preview', 'No image available');
      currentY += 4;
    }

    // PERSONALIZATION
    addSection('PERSONALIZATION DETAILS');
    const textColorName = textColors.find(c => c.value === selectedColor)?.name || selectedColor || 'N/A';
    const personalizationData = [
      ['Vehicle Model', selectedVehicleModel],
      ['Seat Row', selectedSeatView],
      ['Accessory', selectedAccessory],
      ['Personalized Text', personalisedContent],
      ['Font Style', selectedFont],
      ['Text Color', textColorName],
      ['Number of Sets', numSets]
    ];
    personalizationData.forEach(([label, value]) => addDetail(label, value));

    // Footer (no bottom line above)
    pdf.setDrawColor(0, 93, 143);
    pdf.line(15, 290, pageWidth - 15, 290);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by Mahindra Personalization Tool', pageWidth / 2, 295, { align: 'center' });

    // Order No + Date in bottom right
    pdf.setTextColor(0, 93, 143);
    pdf.text(`${orderNo || 'N/A'} - ${orderDate || new Date().toLocaleDateString()}`, pageWidth - 20, 295, { align: 'right' });

    // Save it
    const filename = `Mahindra_Order_${orderNo || Date.now()}.pdf`;
    pdf.save(filename);

  } catch (err) {
    console.error("PDF Error:", err);
    alert("Failed to generate order PDF. Please try again.");
  }
};


  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div
        ref={orderFormRef}
        style={{
          backgroundColor: 'white',
          padding: '30px',
          paddingTop: '40px',
          paddingBottom: '60px',
          borderRadius: '8px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#fff',
            backgroundColor: 'orange',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <img src="/logooo.png" alt="Mahindra Logo" style={{ height: '150px'}} />
          <h2 style={{ margin: '10px 0', color: '#005d8f' }}>Order Details</h2>
        </div>

        {/* Form */}
        <form>
          {/* Order Info */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#005d8f', marginBottom: '15px' }}>Order Information</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '500' }}>Order Number</label>
                <input
                  name="orderNo"
                  type="text"
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  style={getInputStyle('orderNo')}
                />
              </div>
              <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '500' }}>Order Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  style={getInputStyle('orderDate')}
                />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#005d8f' }}>Customer Details</h3>
            <label>Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={getInputStyle('customerName')}
            />
            <label style={{ marginTop: '10px' }}>Mobile Number</label>
            <input
              name="customerMobile"
              type="text"
              value={customerMobile}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setCustomerMobile(val);
              }}
              style={getInputStyle('customerMobile')}
            />
            <label style={{ marginTop: '10px' }}>Address</label>
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              style={{ ...getInputStyle('customerAddress'), minHeight: '80px' }}
            />
          </div>

          {/* Dealership Info */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#005d8f' }}>Dealership Details</h3>
            <label>Dealership Name</label>
            <input
              name="dealershipName"
              type="text"
              value={dealershipName}
              onChange={(e) => setDealershipName(e.target.value)}
              style={getInputStyle('dealershipName')}
            />
            <label style={{ marginTop: '10px' }}>Dealership Address</label>
            <textarea
              value={dealershipAddress}
              onChange={(e) => setDealershipAddress(e.target.value)}
              style={{ ...getInputStyle('dealershipAddress'), minHeight: '80px' }}
            />
            <label style={{ marginTop: '10px' }}>Dealership Phone</label>
            <input
              name="dealershipPhone"
              type="text"
              value={dealershipPhone}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setDealershipPhone(val);
              }}
              style={getInputStyle('dealershipPhone')}
            />
          </div>

          {/* Preview */}
          <div style={{ marginBottom: '25px', textAlign: 'center' }}>
            <h3 style={{ color: '#005d8f', marginBottom: '15px' }}>Design Preview</h3>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                height: '100%',
                maxHeight: '500px',
                width: 'auto',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'inline-block',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Personalization */}
          <div className="personalization-details" style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#005d8f' }}>Personalization Details</h3>
            <p><strong>Vehicle Model:</strong> {selectedVehicleModel}</p>
            <p><strong>Seat Row:</strong> {selectedSeatView}</p>
            <p><strong>Accessory:</strong> {selectedAccessory}</p>
            <p><strong>Personalized Text:</strong> {personalisedContent}</p>
            <p><strong>Font Style:</strong> {selectedFont}</p>
            <p><strong>Text Color:</strong> <span style={{
              display: 'inline-block',
              width: '15px',
              height: '15px',
              backgroundColor: selectedColor,
              border: '1px solid #ccc',
              marginRight: '5px',
              verticalAlign: 'middle'
            }} /> {textColors.find(color => color.value === selectedColor)?.name || selectedColor}</p>
            <p><strong>Number of Sets:</strong> {numSets}</p>
          </div>

          {/* Action Buttons - These will be excluded from PDF */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={handleDownloadOrder}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ec891f',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Download Invoice
            </button>
            {/* <button
              type="button"
              onClick={onShare}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Share
            </button> */}
          </div>
        </form>
      </div>
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
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const orderFormRef = useRef(null);

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

const handleContinue = async () => {
  if (!selectedVehicleModel || !selectedAccessory || !selectedSeatView) {
    setShowPopup(true);
    return;
  }

  if (imageRef.current) {
    try {
      setIsImageLoading(true);
      const canvas = await html2canvas(imageRef.current, {
        scale: 2, // Increased from 1 to 2 for higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        quality: 1, // Maximum quality
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure all fonts are loaded in the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Montserrat:wght@400;700&display=swap');
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      setPreviewImage(canvas.toDataURL('image/jpeg', 1.0)); // Highest quality JPEG
      setShowOrderForm(true);
    } catch (error) {
      console.error("Error capturing preview:", error);
      setShowOrderForm(true);
    } finally {
      setIsImageLoading(false);
    }
  } else {
    setShowOrderForm(true);
  }
};

  const handleShareOrder = async () => {
    if (!orderFormRef.current) return;
    
    try {
      const canvas = await html2canvas(orderFormRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      const image = canvas.toDataURL('image/jpeg', 0.9);
      
      if (navigator.share) {
        const blob = await fetch(image).then(res => res.blob());
        const file = new File([blob], 'order.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'Mahindra Order Details',
          text: 'Check out my Mahindra personalized accessory order',
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'order-preview.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error sharing order:", error);
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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

  if (showOrderForm) {
    return (
      <OrderForm 
        onClose={() => setShowOrderForm(false)}
        onDownload={handleDownload}
        onShare={handleShareOrder}
        selectedVehicleModel={selectedVehicleModel}
        selectedSeatView={selectedSeatView}
        selectedAccessory={selectedAccessory}
        personalisedContent={personalisedContent}
        selectedFont={selectedFont}
        selectedColor={selectedColor}
        numSets={numSets}
        previewImage={previewImage}
      />
    );
  }

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
          <span style={{ fontSize: '14px', color: '#666' }}></span>
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
        
 <div className="button-group" style={{ 
  display: 'flex', 
  gap: '15px',
  marginTop: '20px'
}}>
  <button 
    className="download-btn" 
    onClick={handleDownload} 
    disabled={isImageLoading}
    style={{
      flex: 1,
      padding: '12px',
      backgroundColor: '#ffb12c',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#004a6e'
      }
    }}
  >
    {isImageLoading ? 'Generating PDF...' : 'Download'}
  </button>
  <button 
    className="continue-btn"
    onClick={handleContinue}
    style={{
      flex: 1,
      padding: '12px',
      backgroundColor: '#ffb12c',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#3e8e41'
      }
    }}
  >
    Continue
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