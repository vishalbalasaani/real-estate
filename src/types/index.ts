export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  location: string;
  beds: string;
  price: string;
  sqft: string;
  completion: string;
  category: 'luxury' | 'urban' | 'waterfront';
  features: string[];
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  project: string;
  budget: string;
  message: string;
}
