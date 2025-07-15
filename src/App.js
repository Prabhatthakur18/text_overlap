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
  'Georgia',
  'Segoe UI',
  'Century Gothic',
  'Impact',
  'Verdana',
  'Times New Roman'
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
        { top: '38%', left: '25%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '38%', left: '74%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36.7%', left: '25%', rotation: 0, fontSize: { desktop: 15, mobile: 9 } },
        { top: '36.7%', left: '74%', rotation: 0, fontSize: { desktop: 15, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '68.5%', left: '30.5%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
        { top: '68.5%', left: '68%', rotation: 0, fontSize: { desktop: 15, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '68%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '68%', left: '68%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },
  'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '44.5%', left: '28%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
        { top: '44.5%', left: '72.8%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
       { top: '44.5%', left: '28.4%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
        { top: '44.5%', left: '71.5%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56%', left: '33.6%', rotation: -0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '56%', left: '65%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '57.2%', left: '32.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57.2%', left: '65.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '30.8%', left: '28.2%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
        { top: '31%', left: '75%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '30.5%', left: '28%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
        { top: '31.5%', left: '75%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '61%', left: '35.3%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '61%', left: '71%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '63%', left: '32.6%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '63%', left: '69.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '34%', left: '27%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
        { top: '35.5%', left: '73%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '35%', left: '25.3%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
        { top: '35%', left: '72.5%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '63.5%', left: '28.5%', rotation: -1, fontSize: { desktop: 14, mobile: 10 } },
        { top: '63.5%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '64%', left: '30%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '64%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '34%', left: '24%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
        { top: '34%', left: '72.5%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '34.8%', left: '23%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
        { top: '34.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '60%', left: '26.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '60%', left: '70.2%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '58.5%', left: '26.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '58.5%', left: '72%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '36%', left: '27.5%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
        { top: '35.8%', left: '76%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36.4%', left: '27%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
        { top: '36.4%', left: '75.5%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '57%', left: '32%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '57%', left: '72%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '57%', left: '33%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '57%', left: '70%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '35%', left: '29%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
        { top: '35.2%', left: '70%', rotation: 0, fontSize: { desktop: 12, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '36%', left: '29%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
        { top: '36%', left: '69.8%', rotation: 0, fontSize: { desktop: 12, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '66%', left: '30.8%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
        { top: '66%', left: '66.5%', rotation: 0, fontSize: { desktop: 14, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '68%', left: '31.5%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
        { top: '68%', left: '65.8%', rotation: 0, fontSize: { desktop: 14, mobile: 9 } },
      ]
    }
  }
};


const pdfTextPositions = {
  'THAR ROXX': {
    'Front Row': {
      'Black comfort kit': [
        { top: '32%', left: '25.5%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
        { top: '32%', left: '74%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '30%', left: '25%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '30%', left: '73.7%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '65%', left: '30.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '65%', left: '68%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '65%', left: '30.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '65%', left: '67.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ]
    }
  },
  'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '38.5%', left: '28%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '38.5%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
       { top: '38.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '38.5%', left: '71.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52%', left: '33.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '52%', left: '65.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '54%', left: '32.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '54%', left: '65.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '23.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '23.5%', left: '74.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '23%', left: '28%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '23.8%', left: '75.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '55.5%', left: '35.2%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '55.5%', left: '71%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } }
      ],
      'Sustainable comfort kit': [
        { top: '58%', left: '33%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
        { top: '58%', left: '70%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.2%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '29%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '27.5%', left: '25.3%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '27.5%', left: '72.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '59%', left: '28%', rotation: -1, fontSize: { desktop: 10, mobile: 8 } },
        { top: '59%', left: '69.5%', rotation: 0, fontSize: { desktop: 10, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '59%', left: '30%', rotation: 0, fontSize: { desktop: 10, mobile:8 } },
        { top: '59%', left: '70%', rotation: 0, fontSize: { desktop: 10, mobile:8 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '25.5%', left: '24%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '25.5%', left: '72%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '26%', left: '23.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8  } },
        { top: '26%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56.5%', left: '26.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '56.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '55%', left: '27%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '55%', left: '72.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '29%', left: '27.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '29%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '29.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
        { top: '29.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52.5%', left: '32%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '52.5%', left: '72%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } }
      ],
      'Sustainable comfort kit': [
        { top: '52.5%', left: '33%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '52.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.5%', left: '29%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '28%', left: '70%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '29%', left: '29%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '29%', left: '69.8%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '62.5%', left: '31%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '62.5%', left: '66.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '63.5%', left: '31.5%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
        { top: '63.5%', left: '66%', rotation: 0, fontSize: { desktop: 10, mobile: 10 } },
      ]
    }
  }
};

const previewTextPositions  = {
  'THAR ROXX': {
    'Front Row': {
      'Black comfort kit': [
        { top: '32%', left: '25.5%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
        { top: '32%', left: '74%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '30.5%', left: '25%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
        { top: '30.5%', left: '73.7%', rotation: 0, fontSize: { desktop: 8, mobile: 9 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '64%', left: '30.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '64%', left: '68%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
      ],
      'Sustainable comfort kit': [
        { top: '65%', left: '30.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } },
        { top: '65%', left: '67.5%', rotation: 0, fontSize: { desktop: 8, mobile: 10 } }
      ]
    }
  },
  'THAR': {
    'Front Row': {
      'Black comfort kit': [
        { top: '39%', left: '28%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '39%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
       { top: '38.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '38.5%', left: '71.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52%', left: '33.8%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '52%', left: '65%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '53%', left: '32.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '53%', left: '65%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } }
      ]
    }
  },
  'XUV700': {
    'Front Row': {
      'Black comfort kit': [
        { top: '23.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '23.5%', left: '74.8%', rotation: 0, fontSize: { desktop: 8, mobile:8 } },
      ],
      'Sustainable comfort kit': [
        { top: '23%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '24%', left: '75%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56.5%', left: '35.2%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '56.5%', left: '71%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } }
      ],
      'Sustainable comfort kit': [
        { top: '59%', left: '33%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '59%', left: '70%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    }
  },
  'XUV3X0': {
    'Front Row': {
      'Black comfort kit': [
        { top: '27.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '29.5%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '28%', left: '25.3%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '28%', left: '72.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '59.5%', left: '28.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '59.5%', left: '70%', rotation: 0, fontSize: { desktop: 8, mobile: 8} },
      ],
      'Sustainable comfort kit': [
        { top: '59.5%', left: '30.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8} },
        { top: '59.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile:8 } },
      ]
    }
  },
  'SCORPIO N': {
    'Front Row': {
      'Black comfort kit': [
        { top: '25.78%', left: '24%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '25.78%', left: '72%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '26.5%', left: '23.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '26.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '56.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '56.5%', left: '71%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '54.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '54.5%', left: '73%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    }
  },
  'BOLERO NEO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '29.5%', left: '27.5%', rotation: 0, fontSize: { desktop:8, mobile: 8 } },
        { top: '29.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '29.5%', left: '27%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '29.5%', left: '76%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '52%', left: '32.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '52%', left: '72%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } }
      ],
      'Sustainable comfort kit': [
        { top: '52.5%', left: '32.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '52.5%', left: '70.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    }
  },
  'BOLERO': {
    'Front Row': {
      'Black comfort kit': [
        { top: '29%', left: '29.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '29%', left: '70%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '29%', left: '29.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '29%', left: '69.8%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ]
    },
    'Rear Row': {
      'Black comfort kit': [
        { top: '62.5%', left: '31%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '62.5%', left: '66.5%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
      ],
      'Sustainable comfort kit': [
        { top: '64%', left: '31%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
        { top: '64%', left: '66%', rotation: 0, fontSize: { desktop: 8, mobile: 8 } },
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
  selectedVehicleModel,
  selectedSeatView,
  selectedAccessory,
  personalisedContent,
  selectedFont,
  selectedColor,
  numSets,
  imageRef
}) => {
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [dealershipAddress, setDealershipAddress] = useState('');
  const [dealershipPhone, setDealershipPhone] = useState('');
  const [dealershipManager, setDealershipManager] =useState('');
  const [errors, setErrors] = useState({});

  const orderFormRef = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
const readonlyStyle = {
  padding: '6px 10px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
};

const valueStyle = {
  padding: '6px 10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
  fontSize: '14px',
  minHeight: '32px',
  display: 'flex',
  alignItems: 'center'
};
  const getInputStyle = (fieldName) => ({
    width: '100%',
    padding: '8px 12px',
    border: errors[fieldName] ? '2px solid red' : '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  });

const inputStyle = {
  border: 'none',
  borderBottom: '1px solid #000',
  outline: 'none',
  background: 'transparent',
  fontSize: '12px',
  padding: '2px 0',
  width: '100%'
};
const textareaStyle = {
  ...inputStyle,
  resize: 'none',
  height: '20px',
  marginTop: '0px'
};

const dividerStyle = {
  width: '1.5px',
  backgroundColor: '#003366',
  // height: '100%',
  alignSelf: 'stretch'
};

const handleDownloadOrder = async () => {
  if (!orderFormRef.current) return;
  if (!validateForm()) return;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let currentY = 10;

    // Add Mahindra logo
    const logoUrl = '/logooo.png';
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });
    pdf.addImage(logoDataUrl, 'PNG', margin, currentY, 60, 10);
    
    // Add order title
    currentY += 25;
    pdf.setFontSize(16);
    pdf.setTextColor(0, 93, 143); // Mahindra blue
    pdf.text('PERSONALIZATION ORDER DETAILS', pageWidth / 2, currentY, { align: 'center' });
    
    // Add divider line
    currentY += 5;
    pdf.setDrawColor(0, 93, 143);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Helper functions
    const addSectionHeader = (title) => {
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, currentY, pageWidth - 2*margin, 8, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(title, margin + 3, currentY + 5.5);
      currentY += 12;
    };

    const addTwoColumnDetail = (leftLabel, leftValue, rightLabel, rightValue) => {
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      
      // Left column
      pdf.setTextColor(100, 100, 100);
      pdf.text(leftLabel + ':', margin, currentY);
      pdf.setTextColor(50, 50, 50);
      pdf.text(leftValue || 'N/A', margin + 30, currentY);
      
      // Right column
      pdf.setTextColor(100, 100, 100);
      pdf.text(rightLabel + ':', pageWidth/2 + 10, currentY);
      pdf.setTextColor(50, 50, 50);
      pdf.text(rightValue || 'N/A', pageWidth/2 + 40, currentY);
      
      currentY += 6;
    };

    const addSingleDetail = (label, value) => {
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(label + ':', margin, currentY);
      pdf.setTextColor(50, 50, 50);
      pdf.text(value || 'N/A', margin + 30, currentY);
      currentY += 6;
    };

    const addDividerLine = () => {
      currentY += 3;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;
    };

    // Order Information
    addSectionHeader('ORDER INFORMATION');
    addTwoColumnDetail('Order Number', orderNo, 'Order Date', orderDate);
    addDividerLine();

// CUSTOMER & DEALER DETAILS
addSectionHeader('CUSTOMER & DEALER DETAILS');

// Define column positions
const dealerX = margin;
const customerX = pageWidth / 2 + 5;
let dealerY = currentY + 2;
let customerY = currentY + 2;

// --- Column Headers ---
pdf.setFont(undefined, 'bold');
pdf.setFontSize(11);
pdf.setTextColor(0, 0, 0);
pdf.text('Dealer Info', dealerX, dealerY);
pdf.text('Customer Info', customerX, customerY);

dealerY += 8;
customerY += 8;

// --- Dealer Info ---
pdf.setFont(undefined, 'normal');
pdf.setFontSize(10);
pdf.setTextColor(100, 100, 100);
pdf.text('Dealer Name:', dealerX, dealerY);
pdf.setTextColor(50, 50, 50);
pdf.text(dealershipName || 'N/A', dealerX + 25, dealerY);
dealerY += 6;

pdf.setTextColor(100, 100, 100);
pdf.text('Dealer Access Manager:', dealerX, dealerY);
pdf.setTextColor(50, 50, 50);
pdf.text(dealershipManager || 'N/A', dealerX + 40, dealerY);
dealerY += 6;

pdf.setTextColor(100, 100, 100);
pdf.text('Dealer Manager Access Contact:', dealerX, dealerY);
pdf.setTextColor(50, 50, 50);
pdf.text(dealershipPhone || 'N/A', dealerX + 53, dealerY);
dealerY += 6;

pdf.setTextColor(100, 100, 100);
pdf.text('Dealer Address:', dealerX, dealerY);
pdf.setTextColor(50, 50, 50);
const dealerAddressLines = pdf.splitTextToSize(dealershipAddress || 'N/A', (pageWidth / 2) - margin - 10);
pdf.text(dealerAddressLines, dealerX + 30, dealerY);
dealerY += dealerAddressLines.length * 5;

// --- Customer Info ---
pdf.setTextColor(100, 100, 100);
pdf.text('Customer Name:', customerX, customerY);
pdf.setTextColor(50, 50, 50);
pdf.text(customerName || 'N/A', customerX + 28, customerY);
customerY += 6;

pdf.setTextColor(100, 100, 100);
pdf.text('Customer Phone:', customerX, customerY);
pdf.setTextColor(50, 50, 50);
pdf.text(customerMobile || 'N/A', customerX + 30, customerY);
customerY += 6;

pdf.setTextColor(100, 100, 100);
pdf.text('Customer Address:', customerX, customerY);
pdf.setTextColor(50, 50, 50);
const customerAddressLines = pdf.splitTextToSize(customerAddress || 'N/A', (pageWidth / 2) - margin - 10);
pdf.text(customerAddressLines, customerX + 33, customerY);
customerY += customerAddressLines.length * 5;

// Update currentY to max Y of both columns
currentY = Math.max(dealerY, customerY) + 5;
addDividerLine();

    // Vehicle & Personalization Details
    addSectionHeader('VEHICLE & PERSONALIZATION');
    addTwoColumnDetail('Vehicle Model', selectedVehicleModel, 'Accessory Kit', selectedAccessory);
    addTwoColumnDetail('Personalized Text', personalisedContent, 'Font Style', selectedFont);
    
const textColorName = textColors.find(c => c.value === selectedColor)?.name || selectedColor;

// Draw swatch BEFORE writing row
pdf.setFillColor(selectedColor);
pdf.rect(38, currentY - 3.2, 4, 4, 'F'); // ✅ 120 is a safe X offset for first column value

addTwoColumnDetail('Thread Color', textColorName, 'Quantity', numSets.toString());
    addDividerLine();

    // Design Preview Section
    addSectionHeader('DESIGN PREVIEW');
    
    // Helper function to capture seat view with text
    const captureSeatView = async (seatView) => {
      const element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.width = '500px';
      element.style.height = '390px';


      document.body.appendChild(element);

      const img = document.createElement('img');
      img.src = `/models/${selectedVehicleModel}/${seatView}/${selectedAccessory}.png`;
      img.style.width = '100%';
      img.style.height = '100%';
      element.appendChild(img);

      await new Promise(resolve => {
        img.onload = resolve;
      });

      const positions = pdfTextPositions[selectedVehicleModel]?.[seatView]?.[selectedAccessory] || [];
      
      positions.forEach((position) => {
        const textEl = document.createElement('div');
        textEl.textContent = personalisedContent;
        textEl.style.position = 'absolute';
        textEl.style.top = position.top;
        textEl.style.left = position.left;
        textEl.style.transform = `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`;
        textEl.style.fontFamily = `"${selectedFont}"`;
        
        const fontSize = position.fontSize ? position.fontSize.desktop : 6;
        textEl.style.fontSize = `${fontSize}px`;
        
        textEl.style.color = selectedColor;
        textEl.style.fontStyle = 'italic';
        textEl.style.fontWeight = 'bold';
        textEl.style.WebkitTextStroke = '0.3px rgba(68, 68, 68, 0.5)';
        textEl.style.textShadow = `
          1px 1px 1px rgba(33, 33, 33, 0.28),
          -1px -1px 1px rgba(71, 71, 71, 0.56),
          0 0 2px rgba(37, 36, 36, 0.3)
        `;
        textEl.style.pointerEvents = 'none';
        textEl.style.whiteSpace = 'nowrap';
        element.appendChild(textEl);
      });

      const style = document.createElement('style');
      style.textContent = extraStyles;
      element.appendChild(style);

      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      document.body.removeChild(element);
      return canvas.toDataURL('image/jpeg', 0.9);
    };

  try {
  // Capture both seat views (already at scale: 1.5 for better quality)
  const [frontImage, rearImage] = await Promise.all([
    captureSeatView('Front Row'),
    captureSeatView('Rear Row')
  ]);

  // Create Image objects to get original dimensions
  const frontImg = new Image();
  const rearImg = new Image();
  frontImg.src = frontImage;
  rearImg.src = rearImage;

  await Promise.all([
    new Promise(resolve => frontImg.onload = resolve),
    new Promise(resolve => rearImg.onload = resolve)
  ]);

  // Desired width for each image
  const imgWidth = (pageWidth - 2 * margin - 10) / 2;

  // Maintain aspect ratio for each
  const frontHeight = (frontImg.height / frontImg.width) * imgWidth;
  const rearHeight = (rearImg.height / rearImg.width) * imgWidth;

  // Use the taller height for consistent row spacing
  const imgHeight = Math.max(frontHeight, rearHeight);

  // Add Front Row image
  pdf.addImage(frontImage, 'JPEG', margin, currentY, imgWidth, frontHeight, undefined, 'FAST');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Front Row', margin + imgWidth / 2, currentY + frontHeight + 6, { align: 'center' });

  // Add Rear Row image
  pdf.addImage(rearImage, 'JPEG', margin + imgWidth + 10, currentY, imgWidth, rearHeight, undefined, 'FAST');
  pdf.text('Rear Row', margin + imgWidth + 10 + imgWidth / 2, currentY + rearHeight + 6, { align: 'center' });

  // Move Y based on tallest image
  currentY += imgHeight + 15;

} catch (err) {
  console.error("Error capturing seat views:", err);
  pdf.setFontSize(10);
  pdf.setTextColor(150, 0, 0);
  pdf.text('Design preview could not be generated', margin, currentY);
  currentY += 10;
}

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    
    // Left footer - Generated by
    pdf.text('Generated by Mahindra Personalization Tool', margin, 290);
    
    // Right footer - Order number and date
    const formattedDate = new Date(orderDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
    
    pdf.text(`Order: ${orderNo} - ${formattedDate}`, pageWidth - margin, 290, { align: 'right' });
    
    // Footer line
    pdf.setDrawColor(0, 93, 143);
    pdf.line(margin, 292, pageWidth - margin, 292);

    // Save the PDF
    const filename = `Mahindra_Order_${orderNo || 'ORDER'}_${formattedDate}.pdf`;
    pdf.save(filename);

  } catch (err) {
    console.error("PDF generation error:", err);
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
          borderRadius: '8px',
          maxWidth: '900px',
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
            borderRadius: '20%',
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

  {/* Header with Logo and Centered Title */}
<div
  style={{
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '0px',
    borderBottom: '2px solid #e0e0e0',
    height: '60px' // set height to keep things aligned
  }}
>
  <img
    src="/logooo.png"
    alt="Mahindra Logo"
    style={{
      height: '30px',
      marginRight: '20px'
    }}
  />

  <h2
    style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      margin: 0,
      color: '#005d8f',
      fontSize: '24px',
      fontWeight: 'bold'
    }}
  >
    Personalization Order details
  </h2>
</div>


        {/* Order Number and Date - Top Right */}
   <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    marginBottom: '10px',
    textAlign: 'right',
    // position: 'absolute',
    // top: '80px',
    right: '30px'
  }}
>
  {/* Order Number Row */}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <label
      style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '10px',
        minWidth: '110px'
      }}
    >
      Order Number :
    </label>
    <input
      name="orderNo"
      type="text"
      value={orderNo}
      onChange={(e) => setOrderNo(e.target.value)}
      style={{
        ...getInputStyle('orderNo'),
        width: '100px',
        textAlign: 'center'
      }}
    />
  </div>

  {/* Order Date Row */}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <label
      style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '10px',
        minWidth: '110px'
      }}
    >
      Order Date :
    </label>
    <input
      type="date"
      value={orderDate}
      onChange={(e) => setOrderDate(e.target.value)}
      style={{
        ...getInputStyle('orderDate'),
        width: '100px',
        textAlign: 'center'
      }}
    />
  </div>
</div>

        {/* Main Content Area */}
<div style={{ borderTop: '2px solid #005d8f', paddingTop: '0px' }}>
  <div
    style={{
      display: 'flex',
      padding: '20px 0',
      gap: '0px',
      alignItems: 'flex-start'
    }}
  >
    {/* Dealer Info */}
    <div style={{ flex: 1, paddingRight: '20px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Dealer Name :</label>
        <input type="text" value={dealershipName} onChange={(e) => setDealershipName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Dealer Access Manager :</label>
        <input type="text" value={dealershipManager} maxLength={30} onChange={(e) => setDealershipManager(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Dealer Access Manager Contact:</label>
        <input type="text" inputMode="numeric" maxLength={10} value={dealershipPhone} onChange={(e) => setDealershipPhone(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px', marginTop: '6px' }}>Dealer Address :</label>
        <textarea value={dealershipAddress} onChange={(e) => setDealershipAddress(e.target.value)} style={textareaStyle} />
      </div>
    </div>

    {/* Divider */}
    <div style={dividerStyle} />

    {/* Customer Info */}
    <div style={{ flex: 1, padding: '0 20px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Customer Name :</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Customer Phone :</label>
        <input type="text" value={customerMobile} maxLength={10} onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
      </div>  

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px', marginTop: '6px' }}>Customer Add :</label>
        <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} style={textareaStyle} />
      </div>
    </div>

    {/* Divider */}
    <div style={dividerStyle} />

    {/* Vehicle Info */}
    <div style={{ flex: 1, paddingLeft: '20px' }}>
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Vehicle Model :</label>
        <span>{selectedVehicleModel}</span>
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Accessory :</label>
        <span>{selectedAccessory}</span>
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Text Content :</label>
        <span>{personalisedContent}</span>
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Font :</label>
        <span>{selectedFont}</span>
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Thread :</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: selectedColor,
              border: '1px solid #ccc',
              borderRadius: '3px'
            }}
          />
          <span>{textColors.find((c) => c.value === selectedColor)?.name || selectedColor}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <label style={{ fontWeight: 'bold', minWidth: '140px' }}>Qty :</label>
        <span>{numSets}</span>
      </div>
    </div>
  </div>
</div>






{/* Design Preview Section */}
{/* Design Preview Section */}
<div style={{ 
  marginTop: '30px',
  textAlign: 'center',
  borderTop: '2px solid #e0e0e0',
  paddingTop: '20px'
}}>
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '40px',
    flexWrap: 'wrap'
  }}>
    {/* Front Row Image */}
    <div>
      <h4 style={{ 
        marginBottom: '10px',
        color: '#005d8f',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        Front Row
      </h4>
      <div style={{ 
        position: 'relative', 
        display: 'inline-block',
        width: '380px',
        height: '300px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <img
          src={`/models/${selectedVehicleModel}/Front Row/${selectedAccessory}.png`}
          alt="Front Row Preview"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        {fontsLoaded && personalisedContent && previewTextPositions[selectedVehicleModel]?.['Front Row']?.[selectedAccessory]?.map((position, index) => {
          const fontSize = position.fontSize 
            ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
            : (isMobile ? 16 : 22);
          
          return (
            <div
              key={`front-${index}`}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`,
                fontFamily: `"${selectedFont}"`,
                fontSize: `${fontSize}px`,
                color: selectedColor,
                fontStyle: 'italic',
                fontWeight: 'bold',
                WebkitTextStroke: '0.5px rgba(68, 68, 68, 0.5)',
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
              {personalisedContent}
            </div>
          );
        })}
      </div>
    </div>

    {/* Rear Row Image */}
    <div>
      <h4 style={{ 
        marginBottom: '10px',
        color: '#005d8f',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        Rear Row
      </h4>
      <div style={{ 
        position: 'relative', 
        display: 'inline-block',
        width: '380px',
        height: '300px',
        border: '2px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <img
          src={`/models/${selectedVehicleModel}/Rear Row/${selectedAccessory}.png`}
          alt="Rear Row Preview"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        {fontsLoaded && personalisedContent && previewTextPositions[selectedVehicleModel]?.['Rear Row']?.[selectedAccessory]?.map((position, index) => {
          const fontSize = position.fontSize 
            ? (isMobile ? position.fontSize.mobile : position.fontSize.desktop)
            : (isMobile ? 16 : 22);
          
          return (
            <div
              key={`rear-${index}`}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`,
                fontFamily: `"${selectedFont}"`,
                fontSize: `${fontSize}px`,
                color: selectedColor,
                fontStyle: 'italic',
                fontWeight: 'bold',
                WebkitTextStroke: '0.5px rgba(68, 68, 68, 0.5)',
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
              {personalisedContent}
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>

        {/* Download Button */}
        <div style={{ 
          marginTop: '30px',
          textAlign: 'center',
          borderTop: '2px solid #e0e0e0',
          paddingTop: '20px'
        }}>
          <button
            type="button"
            onClick={handleDownloadOrder}
            style={{
              padding: '12px 30px',
              backgroundColor: '#ec891f',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Download Invoice
          </button>
        </div>
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
     <h3 style={{ fontFamily: 'Georgia, serif' }}>PERSONALISED ACCESSORIES</h3>
<p style={{ fontFamily: 'Georgia, serif', marginTop:'-20px' }}>
  Showcase your unique style by personalizing your accessory with elegantly embroidered lettering in your preferred font.
</p>


{/* //drop down code  */}

<>
{/* Vehicle Model */}
<label style={{ fontFamily: 'Georgia, serif' }}>Vehicle Model</label>
<select
  value={selectedVehicleModel}
  onChange={e => setSelectedVehicleModel(e.target.value)}
  style={{ fontFamily: 'Georgia, serif' }} // ✅ Selected text in Georgia
>
  <option
    value=""
    disabled
    style={{ fontFamily: 'Georgia, serif', fontStyle: 'normal' }} // ✅ Placeholder text in Georgia
  >
    Select a Vehicle Model
  </option>
  {vehicleModels.map(model => (
    <option
      key={model}
      value={model}
      style={{ fontFamily: 'Georgia, serif' }} // ✅ Option text in Georgia
    >
      {model}
    </option>
  ))}
</select>

{/* Select Row */}
<label style={{ fontFamily: 'Georgia, serif' }}>Select Row</label>
<select
  value={selectedSeatView}
  onChange={e => setSelectedSeatView(e.target.value)}
  disabled={!selectedVehicleModel}
  style={{ fontFamily: 'Georgia, serif' }} // ✅ Ensures selected value uses Georgia
>
  <option
    value=""
    disabled
    style={{ fontFamily: 'Georgia, serif', fontStyle: 'normal' }} // ✅ Placeholder text in Georgia
  >
    Select Row
  </option>
  {seatViews.map(view => (
    <option
      key={view}
      value={view}
      style={{ fontFamily: 'Georgia, serif' }} // ✅ Each option in Georgia
    >
      {view}
    </option>
  ))}
</select>


{/* Kit Type */}
<label style={{ fontFamily: 'Georgia, serif' }}>Kit Type</label>
<select
  value={selectedAccessory}
  onChange={e => setSelectedAccessory(e.target.value)}
  disabled={!selectedVehicleModel || !selectedSeatView}
  style={{ fontFamily: 'Georgia, serif' }} // ✅ Whole select defaults to Georgia
>
  <option
    value=""
    disabled
    style={{ fontFamily: 'Georgia, serif', fontStyle: 'normal' }} // ✅ Placeholder in Georgia
  >
    Select an Accessory
  </option>
  {accessories.map(acc => (
    <option
      key={acc}
      value={acc}
      style={{ fontFamily: 'Georgia, serif' }} // ✅ Options in Georgia
    >
      {acc}
    </option>
  ))}
</select>


{/* Personalised Content */}
<label style={{ fontFamily: 'Georgia, serif' }}>Personalised Content</label>
        {/* <label>Personalised Content</label> */}
        <input
          type="text"
          maxLength={7}
          value={personalisedContent}
          onChange={e => setPersonalisedContent(e.target.value)}
          style={{ fontFamily: selectedFont }}
        />
{/* Font Style */}
{/* Font Style */}
<label style={{ fontFamily: 'Georgia, serif' }}>Font Style</label>
<select
  value={selectedFont}
  onChange={e => setSelectedFont(e.target.value)}
  style={{ fontFamily: selectedFont || 'Georgia, serif' }} // ✅ If nothing selected, Georgia
>
  <option
    value=""
    disabled
    style={{ fontFamily: 'Georgia, serif', fontStyle: 'normal' }} // ✅ Placeholder in Georgia
  >
    Select a Font Style
  </option>
  {fontStyles.map(font => (
    <option
      key={font}
      value={font}
      style={{ fontFamily: font, fontStyle: 'italic' }} // ✅ Each font shown as actual
    >
      {font}
    </option>
  ))}
</select>


{/* Text Color */}
<label style={{ fontFamily: 'Georgia, serif' }}>Select Text Color</label>
<div className="color-palette">
  {textColors.map(color => (
    <div
      key={color.value}
      className={`color-swatch ${selectedColor === color.value ? 'selected' : ''}`} // ✅ Fixed template literal
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


{/* No. of Sets */}
<label style={{ fontFamily: 'Georgia, serif' }}>No. of Sets</label>
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
      MozAppearance: 'textfield',
      fontFamily: 'Georgia, serif' // ✅ Apply Georgia
    }}
  />
  <span
    style={{
      position: 'absolute',
      left: '5px',
      top: '55%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'Georgia, serif'
    }}
    onClick={() => setNumSets(prev => Math.max(1, prev - 1))}
  >
    −
  </span>
  <span
    style={{
      position: 'absolute',
      right: '-47px',
      top: '55%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'Georgia, serif'
    }}
    onClick={() => setNumSets(prev => prev + 1)}
  >
    +
  </span>
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
           fontFamily: 'Georgia, serif',
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
           fontFamily: 'Georgia, serif',
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
    </>
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