// Mock data for investor demo

export interface DentalCase {
  id: string;
  patientName: string;
  treatment: string;
  description: string;
  zipCode: string;
  createdAt: string;
  status: 'open' | 'bidding' | 'closed';
  bidCount: number;
}

export interface Bid {
  id: string;
  caseId: string;
  officeName: string;
  officeAddress: string;
  price: number;
  estimatedDuration: string;
  experience: string;
  rating: number;
  responseTime: string;
}

export const mockCases: DentalCase[] = [
  {
    id: '1',
    patientName: 'John D.',
    treatment: 'Dental Implant',
    description: 'Need single tooth implant for upper left molar',
    zipCode: '85295',
    createdAt: '2026-02-01',
    status: 'bidding',
    bidCount: 3
  },
  {
    id: '2',
    patientName: 'Sarah M.',
    treatment: 'Root Canal',
    description: 'Root canal needed for lower right premolar with crown',
    zipCode: '85234',
    createdAt: '2026-02-02',
    status: 'open',
    bidCount: 0
  }
];

export const mockBids: Bid[] = [
  {
    id: '1',
    caseId: '1',
    officeName: 'Gilbert Dental Care',
    officeAddress: '1234 E Baseline Rd, Gilbert, AZ 85234',
    price: 2800,
    estimatedDuration: '2-3 visits over 4 months',
    experience: '15+ years, 200+ implants',
    rating: 4.8,
    responseTime: '2 hours'
  },
  {
    id: '2',
    caseId: '1',
    officeName: 'Arizona Smile Center',
    officeAddress: '5678 S Val Vista Dr, Gilbert, AZ 85298',
    price: 3200,
    estimatedDuration: '3 visits over 3 months',
    experience: '20+ years, specialty in implants',
    rating: 4.9,
    responseTime: '1 hour'
  },
  {
    id: '3',
    caseId: '1',
    officeName: 'Desert Ridge Dentistry',
    officeAddress: '9012 E Williams Field Rd, Mesa, AZ 85212',
    price: 2500,
    estimatedDuration: '2 visits over 5 months',
    experience: '10+ years, 150+ implants',
    rating: 4.7,
    responseTime: '3 hours'
  }
];

// Simulated API calls
export const getCases = (): Promise<DentalCase[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCases), 500);
  });
};

export const getBidsForCase = (caseId: string): Promise<Bid[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bids = mockBids.filter(bid => bid.caseId === caseId);
      resolve(bids);
    }, 500);
  });
};
